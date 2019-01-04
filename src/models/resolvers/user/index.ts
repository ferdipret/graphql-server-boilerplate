import { IResolvers, UserQueryArgs } from '../../../generated/graphql'

const users: any = {
  1: {
    userID: 1,
    firstname: 'Ferdi',
    lastname: 'Pretorius',
  },
  2: {
    userID: 2,
    firstname: 'Joe',
    lastname: 'Bloggs',
  },
}

export const resolvers: IResolvers = {
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
}
