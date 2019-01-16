import { IResolvers } from '../../../generated/graphql'
import { User } from '../../entities/user'
import { ResolverMap } from '../resolvers'
import { duplicateEmail } from './constants'
import { schema } from './schemaValidator'

const users: any = {
  1: {
    userID: 1,
    firstname: 'Jim',
    lastname: 'Pope',
  },
  2: {
    userID: 2,
    firstname: 'Joe',
    lastname: 'Bloggs',
  },
}

export const userResolver: ResolverMap = {
  Query: {
    users: () => {
      return Object.values(users)
    },
    user: (_, { userID }) => {
      return users[userID]
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
      } catch {
        /** If the schema doesn't match, we'll use a early return statement. */
        return 'Schema is not valid'
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
            message: duplicateEmail,
          },
        ]
      }

      /**
       * If we reach this point, we have a valid schema and the user doesn't yet exist.
       * Therefor we can go ahead and create the user.
       */
      const user: User = User.create({
        email,
        password,
      })

      /**
       * Don't forget to save, so we actually write the new entry into the database.
       */
      await user.save()

      // if (process.env.NODE_ENV !== "test") {
      //   await sendEmail(
      //     email,
      //     await createConfirmEmailLink(url, user.id, redis)
      //   );
      // }

      /** For now we don't need to return anything when this mutation completes successfully. */
      return null
    },
  },
}
