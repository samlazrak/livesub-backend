import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { resolvers } from './resolvers';
import { createTypeormConn } from './utils/createTypeormConn';

export const server = async () => {
  const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));
  // const typeDefs = importSchema('src/schema.graphql');
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apollo = new GraphQLServer({ schema });
  await createTypeormConn();
  const app = await apollo.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  console.log('🚀 Server ready at http://localhost:4000');

  return app;
};
