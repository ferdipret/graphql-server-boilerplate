import { ApolloError } from 'apollo-server-errors'
import { DUPLICATE_EMAIL, INVALID_TOKEN } from './constants'

const DuplicateEmailError: any = new ApolloError(DUPLICATE_EMAIL, 'UserAlreadyExists')
const TokenError: any = new ApolloError(INVALID_TOKEN, 'InvalidToken')

export { DuplicateEmailError, TokenError }
