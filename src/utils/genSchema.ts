import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import * as path from 'path';

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, '../schema'));
  folders.forEach(folder => {
    const { resolvers } = require(`../schema/${folder}/resolvers`);
    const typeDefs = importSchema(path.join(__dirname, `../schema/${folder}/schema.graphql`));
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  return mergeSchemas({ schemas });
};
