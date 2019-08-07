import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import * as path from 'path';
import * as fs from 'fs';

import { createTypeormConn } from './utils/createTypeormConn';

export const server = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, './schema'));
  folders.forEach((folder) => {
    const { resolvers } = require(`./schema/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./schema/${folder}/schema.graphql`),
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const Server = new GraphQLServer({ schema: mergeSchemas({ schemas }) });
  await createTypeormConn();
  const app = await Server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  console.log('🚀  Server is running on localhost:4000');

  return app;
};
