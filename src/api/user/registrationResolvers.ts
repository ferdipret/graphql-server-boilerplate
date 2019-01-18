import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'
import { formatYupError } from '../../utils/formatYupError'
import { DUPLICATE_EMAIL } from './constants'
import { schema } from './schemaValidator'

const users: any = [
  {
    userId: '1',
    firstname: 'Jim',
    lastname: 'Pope',
  },
  {
    userId: '2',
    firstname: 'Joe',
    lastname: 'Bloggs',
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

  User: {
    username: parent => {
      return `${parent.firstname} ${parent.lastname}`
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

      /** Next we'll see whether this user already exists */
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
      const saltRounds: number = 10
      const user: User = User.create({
        email,
        password: await bcrypt.hash(password, saltRounds),
      })

      /** Don't forget to save, so we actually write the new entry into the database. */
      await user.save()

      /** Return json web token */
      return jwt.sign({ id: user.id, email: user.email }, 'shhhhhhhh-secret', { expiresIn: '1y' })
    },
  },
}
