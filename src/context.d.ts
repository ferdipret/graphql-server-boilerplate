import { User } from "./models/user"

export interface IGraphQLSession {
  jwtSecret: string
  clientHost: string
}

export interface IGraphQLContext {
  session: IGraphQLSession
  user: User
}
