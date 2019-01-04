import { mergeResolvers } from 'merge-graphql-schemas'
import userResolver from './user'

const resolvers: Array<string | any> = [userResolver]

export default mergeResolvers(resolvers)
