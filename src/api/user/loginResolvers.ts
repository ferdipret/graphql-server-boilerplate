import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { IResolvers } from '../../generated/graphql'
import { getUserByEmail, User } from '../../models/user'
import { login } from '../../models/user/user.repository'

/**
 * In general, we'll be handling authorization the way apollo recommends. By checking the token in
 * the context handler, and adding the user based on the token to the context. This means, when we
 * login, we need to return a token to the client. The client in turn will sent this token with
 * every subsequent query.
 *
 * Therefore we can login using 2 methods, when the user already has a token, the client should use
 * the `loginWithToken` method, which will simply check the token is still valid and return it as
 * is. This will avoid the case that a user will never need to login again. If a user logs in using
 * their credentials, the client should use the `loginWithCredentials` method, here we can refresh
 * the expiry date on the token, and send a fresh token.
 */
const userLoginResolver: IResolvers = {
  Mutation: {
    loginWithCredentials: async (_, args, context) => {
      const { email, password } = args
      const { session } = context

      const user: User | undefined = await getUserByEmail(email)

      if (user) {
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return 'invalid password'
        }

        login(user.id)

        return jwt.sign({ id: user.id, email: user.email }, session.jwtSecret, {
          expiresIn: '1y',
        })
      }

      return null
    },

    loginWithToken: async (_, args, context) => {
      let tokenData: User | undefined
      const { token } = args
      const { session } = context

      try {
        tokenData = jwt.verify(token, session.jwtSecret) as User
      } catch (error) {
        return error
      }

      if (tokenData) {
        const user: User | undefined = await getUserByEmail(tokenData.email)

        if (user) {
          await login(user.id)
        }
      }

      return token
    },
  },
}

export { userLoginResolver }
