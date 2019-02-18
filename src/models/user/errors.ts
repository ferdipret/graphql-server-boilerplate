import { ApolloError } from 'apollo-server-errors'

import { USER_EMAIL_NOT_FOUND, USER_ID_NOT_FOUND } from './constants'

const UserEmailNotFound: any = new ApolloError(USER_EMAIL_NOT_FOUND, 'UserNotFound')
const UserIDNotFound: any = new ApolloError(USER_ID_NOT_FOUND, 'UserNotFound')

export { UserEmailNotFound, UserIDNotFound }
