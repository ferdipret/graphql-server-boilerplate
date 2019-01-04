import { gql } from 'apollo-server-express'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import * as path from 'path'

const typesArray: string[] = fileLoader(path.join(__dirname, '.'), {
  recursive: true,
})

const mergedTypes: string = mergeTypes(typesArray, { all: true })

export default gql(mergedTypes)
