import "reflect-metadata";

import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || "Stuff"}`
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(() => console.log(`Server is running on localhost:4000`));
