import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'
import { resetPassword, updateUserPassword } from '../../models/user/user.repository'
import { sendResetPasswordEmail } from '../../utils/email'

const resetPasswordResolver: IResolvers = {
  Mutation: {
    resetPassword: async (_, args, context) => {
      const { email } = args
      const { session } = context

      const user: User | undefined = await resetPassword(email)

      if (user) {
        /** Sign json web token. */
        const token: string = jwt.sign({ id: user.id, email: user.email }, session.jwtSecret, {
          expiresIn: '7d',
        })
        /** Send reset password email. */
        sendResetPasswordEmail({
          recipient: 'ferdinandpretorius@gmail.com',
          url: `http://localhost:7331/reset-password/${token}`,
        })
      }
    },

    updatePassword: async (_, args, context) => {
      let validToken: string | { [key: string]: any } | null
      const { token, password } = args
      const { session } = context

      /** Check the token is valid */
      try {
        await jwt.verify(token, session.jwtSecret)
        validToken = jwt.decode(token) as object
      } catch (error) {
        return error
      }

      if (validToken) {
        /** Update the users new password */
        const user: User | undefined = await updateUserPassword(validToken.email, password)

        if (user) {
          /** Before returning the new token, let's make sure our user is not undefined */
          return jwt.sign({ id: user.id, email: user.email }, session.jwtSecret, {
            expiresIn: '1y',
          })
        }
      }

      return null
    },
  },
}

export { resetPasswordResolver }
