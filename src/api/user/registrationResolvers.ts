import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { getUserByEmail, User, UserRoleType, verifyUser } from '../../models/user'
import { sendVerifyEmail } from '../../utils/email'
import { formatYupError } from '../../utils/formatYupError'
import { DUPLICATE_EMAIL } from './constants'
import { verifyRegistrationEmail } from './schemaValidator'

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

const userRegistrationResolver: IResolvers = {
  Query: {
    users: () => {
      return Object.values(users)
    },
    user: (_, { userId }) => {
      return users.find((id: string) => id === userId)
    },
  },

  Mutation: {
    register: async (_, args, context) => {
      /** First we need to validate that the incoming arguements match the schema. */
      try {
        await verifyRegistrationEmail.validate(args, { abortEarly: false })
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
       * Therefore we can go ahead and create the user.
       */
      const saltRounds: number = 16
      const user: User = User.create({
        email,
        password: await bcrypt.hash(password, saltRounds),
        isVerified: false,
        hasRequestedPasswordReset: false,
        isLoggedIn: false,
        role: UserRoleType.User,
      })

      /** Don't forget to save, so we actually write the new entry into the database. */
      await user.save()

      const { session } = context

      /** Sign json web token. */
      const token: string = jwt.sign({ id: user.id, email: user.email }, session.jwtSecret, {
        expiresIn: '7d',
      })

      /** Send verification email. */
      sendVerifyEmail({
        recipient: user.email,
        url: `${session.clientHost}/validate-email/${token}`,
      })

      return token
    },

    verify: async (_, args, context) => {
      /** If a valid token is returned we need to store it so we can decode the token. */
      let validToken: User | string
      const { token } = args
      const { session } = context

      try {
        /** Verify that the token is indeed valid. */
        validToken = jwt.verify(token, session.jwtSecret) as User
      } catch (error) {
        return error
      }

      if (validToken) {
        const user: User | undefined = await getUserByEmail(validToken.email)

        if (user) {
          const verifiedUser: User | undefined = await verifyUser(user.id)

          /** Before returning the new token, let's make sure our user is not undefined */
          return (
            verifiedUser &&
            jwt.sign({ id: verifiedUser.id, email: verifiedUser.email }, session.jwtSecret, {
              expiresIn: '1y',
            })
          )
        }
      }

      return null
    },
  },
}

export { userRegistrationResolver }
