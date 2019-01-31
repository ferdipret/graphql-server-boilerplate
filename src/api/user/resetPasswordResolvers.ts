import { IResolvers } from '../../generated/graphql'
import { User } from '../../models/user'
import { resetPassword } from '../../models/user/user.repository'
import { sendResetPasswordEmail } from '../../utils/email'

const resetPasswordResolver: IResolvers = {
  Mutation: {
    resetPassword: async (_, args) => {
      const { email } = args

      const user: User | undefined = await resetPassword(email)

      if (user) {
        /** Send reset password email. */
        sendResetPasswordEmail({
          recipient: 'ferdinandpretorius@gmail.com',
          url: `http://localhost:7331/reset-password`,
        })
      }
    },
  },
}

export { resetPasswordResolver }
