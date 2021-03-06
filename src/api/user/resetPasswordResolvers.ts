import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'
import { resetPassword, updateUserPassword } from '../../models/user/user.repository'
import { sendMail } from '../../utils/email'
import { emailBodies } from '../../utils/emailContent'

const userResetPasswordResolver: IResolvers = {
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
        sendMail({
          recipient: user.email,
          content: emailBodies.sendResetPasswordEmail(
            `${session.clientHost}/reset-password/${token}`,
          ),
          subject: 'Reset password',
        })

        return true
      }

      return false
    },

    updatePassword: async (_, args, context) => {
      let validToken: string | User
      const { token, password } = args
      const { session } = context

      /** Check the token is valid */
      try {
        validToken = (await jwt.verify(token, session.jwtSecret)) as User
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

export { userResetPasswordResolver }
