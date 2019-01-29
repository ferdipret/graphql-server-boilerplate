import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'

export const userLoginResolver: IResolvers = {
  Mutation: {
    loginWithCredentials: async (_, args) => {
      const { email, password } = args

      const user: User | undefined = await User.findOne({ email })

      if (user) {
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password)

        return (
          isPasswordValid &&
          jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '1y',
          })
        )
      }

      return null
    },

    loginWithToken: async (_, args) => {
      const { token } = args

      try {
        jwt.verify(token, process.env.JWT_SECRET as string)
      } catch (error) {
        return error
      }

      return token
    },
  },
}
