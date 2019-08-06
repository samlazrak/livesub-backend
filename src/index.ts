import 'reflect-metadata';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
import { createTypeormConn } from './utils/createTypeormConn';

const typeDefs = importSchema('src/schema.graphql');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new GraphQLServer({ schema });

createTypeormConn().then((_connection) => {
  server.start(() => console.log(`🚀 Server ready at http://localhost:4000`));
});
