import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import chalk from 'chalk'
import * as cors from 'cors'
import { config } from 'dotenv'
import * as express from 'express'
import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm'

import { resolvers, typeDefs } from './api'
import { IGraphQLSession } from './context'
import { getUserByToken, User } from './models/user'
import { log } from './utils/logger'

config()

const DEV_PORT: number = 1337
const PORT: number = (process.env.PORT || DEV_PORT) as number
const PORT_PRINTER: TemplateStringsArray | string = PORT.toString()

/**
 * We need to start the TypeORM connection before we can do anything.
 *
 * We'll need to use this connection throughout the app so we'll store it in a variable.
 */
const connection: Promise<Connection> = (async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions()

  /**
   * Once we have the connection options we can create the connection by giving a connection name.
   */
  const connectionInitializer: Connection = await createConnection({
    ...connectionOptions,
    name: 'default',
  })

  /**
   * Initialise the express app.
   * This will become a middleware for the apollo server.
   */
  const app: express.Application = express()

  app.use(cors())

  /** Instantiate the ApolloServer. */
  const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: any) => {
      // Get the user token from the headers.
      const token: string = req.headers.authorization || ''

      // Try to retrieve a user with the token.
      const user: User | undefined = await getUserByToken(token)

      if (!user) {
        throw new Error('You must be logged in!')
      }

      const session: IGraphQLSession = {
        jwtSecret: process.env.JWT_SECRET as string,
        clientHost: 'http://localhost:7331',
      }

      log(user)

      // Add the user to the context.
      return { user, session }
    },
  })

  /** Apply the express as middleware to the graphql server. */
  server.applyMiddleware({ app, path: '/api' })

  /** Start up the server. */
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

  return connectionInitializer
})()

export { connection }
