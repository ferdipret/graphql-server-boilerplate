import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'
import { logout } from '../../models/user/user.repository'

const userLogoutResolver: IResolvers = {
  Mutation: {
    logout: async (_, args, context) => {
      let tokenData: User
      const { token } = args
      const { session } = context

      try {
        tokenData = jwt.verify(token, session.jwtSecret) as User
      } catch (error) {
        return error
      }

      await logout(tokenData.id)

      return true
    },
  },
}

export { userLogoutResolver }
