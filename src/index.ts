import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import chalk from 'chalk'
import * as cors from 'cors'
import * as express from 'express'

import resolvers from './models/resolvers'
import typeDefs from './models/schema'
import { log } from './utils/logger'

const DEV_PORT: number = 1337
const PORT: number = (process.env.PORT || DEV_PORT) as number
const PORT_PRINTER: TemplateStringsArray | string = PORT.toString()

/**
 * Initialise the express app
 * This will become a middleware for the apollo server
 */
const app: express.Application = express()

// Writing this comment made me realise I know very little about cors...
app.use(cors())

/**
 * Instantiate the ApolloServer
 */
const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

/**
 * Apply the express ass middleware to the graphql server
 */
server.applyMiddleware({ app, path: '/api' })

/**
 * Start up the server
 */
app.listen({ port: PORT }, () => {
  log(
    chalk.bold.green(
      `
Server is running on localhost:${chalk.underline.yellow(PORT_PRINTER)}
${chalk.dim.blue('GraphQL Playground route is `/api`')}
      `,
    ),
  )
})
