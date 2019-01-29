import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'
import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { getUserByEmail, User, verifyUser } from '../../models/user'
import { formatYupError } from '../../utils/formatYupError'
import { sendEmail } from '../../utils/sendEmail'
import { DUPLICATE_EMAIL } from './constants'
import { schema } from './schemaValidator'

config()

const users: any = [
  {
    userId: '1',
    email: 'jimpope@gmail.com',
    password: 'jimmy2cent',
  },
  {
    userId: '2',
    email: 'joebloggs@gmail.com',
    password: 'joey2cent',
  },
]

export const userRegistrationResolver: IResolvers = {
  Query: {
    users: () => {
      return Object.values(users)
    },
    user: (_, { userId }) => {
      return users.find((id: string) => id === userId)
    },
  },

  Mutation: {
    register: async (_, args) => {
      /** First we need to validate that the incoming arguements match the schema. */
      try {
        await schema.validate(args, { abortEarly: false })
      } catch (error) {
        /** If the schema doesn't match, we'll use an early return statement. */
        return formatYupError(error)
      }
      const { email, password } = args

      /** Next we'll see whether this user already exists. */
      const userAlreadyExists: User | undefined = await User.findOne({
        where: { email },
        select: ['id'],
      })

      /** If the user already exists, we'll use another early return statement. */
      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: DUPLICATE_EMAIL,
          },
        ]
      }

      /**
       * If we reach this point, we have a valid schema and the user doesn't yet exist.
       * Therefor we can go ahead and create the user.
       */
      const saltRounds: number = 16
      const user: User = User.create({
        email,
        password: await bcrypt.hash(password, saltRounds),
        isVerified: false,
      })

      /** Don't forget to save, so we actually write the new entry into the database. */
      await user.save()

      /** Sign json web token. */
      const token: string = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '7d',
        },
      )

      /** Send verification email. */
      sendEmail({
        recipient: 'ferdinandpretorius@gmail.com',
        url: `http://localhost:7331/validate-email/${token}`,
      })

      return token
    },

    verify: async (_, args) => {
      /** If a valid token is returned we need to store it so we can decode the token. */
      let validToken: string | object
      let tokenData: string | { [key: string]: any } | null
      const token: string = args.token

      try {
        /** Verify that the token is indeed valid. */
        validToken = jwt.verify(token, process.env.JWT_SECRET as string)
      } catch (error) {
        return error
      }

      if (validToken) {
        /** Decode and return the token data. */
        tokenData = jwt.decode(token) as object

        const user: User | undefined = await getUserByEmail(tokenData.email)

        if (user) {
          const userVerified: User | undefined = await verifyUser(user.id)

          return userVerified
        }
      }

      return null
    },
  },
}
