import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'
import * as jwt from 'jsonwebtoken'

import { IGraphQLContext } from '../../context'
import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'

export const userLoginResolver: IResolvers = {
  Mutation: {
    loginWithCredentials: async (_, args, context) => {
      const { email, password } = args
      const { session } = context

      const user: User | undefined = await User.findOne({ email })

      if (user) {
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password)

        return (
          isPasswordValid &&
          jwt.sign({ id: user.id, email: user.email }, session.jwtSecret, {
            expiresIn: '1y',
          })
        )
      }

      return null
    },

    loginWithToken: async (_, args, context) => {
      const { token } = args
      const { session } = context

      try {
        jwt.verify(token, session.jwtSecret)
      } catch (error) {
        return error
      }

      return token
    },
  },
}
