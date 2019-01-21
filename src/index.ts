import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import chalk from 'chalk'
import * as cors from 'cors'
import { config } from 'dotenv'
import * as express from 'express'
import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm'

import { resolvers, typeDefs } from './api'
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
const connection: any = (async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions()

  /**
   * Once we have the connection options we can create the connection by giving a connection name.
   */
  createConnection({ ...connectionOptions, name: 'default' })
    .then(() => {
      /**
       * Initialise the express app.
       * This will become a middleware for the apollo server.
       */
      const app: express.Application = express()

      // Writing this comment made me realise I know very little about cors...
      app.use(cors())

      /** Instantiate the ApolloServer. */
      const server: ApolloServer = new ApolloServer({
        typeDefs,
        resolvers,
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
    })
    .catch(error => {
      log(error)
    })
})()

export { connection }
