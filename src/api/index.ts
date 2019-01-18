import { gql } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import { IResolvers } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import * as path from 'path'
import { userRegistrationResolver } from './user/registration.resolvers'

const resolversArray: Array<string | any> = [userRegistrationResolver]
const resolvers: IResolvers<any, any> | undefined = mergeResolvers(resolversArray)

const typesArray: string[] = fileLoader(path.join(__dirname, './**/*.graphql'), {
  recursive: true,
})

const mergedTypes: string = mergeTypes(typesArray, { all: true })

const typeDefs: DocumentNode | DocumentNode[] | undefined = gql(mergedTypes)

export { resolvers, typeDefs }
