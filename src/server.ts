import { GraphQLServer } from 'graphql-yoga';
import { redis } from './redis';

import { createTypeormConn } from './utils/createTypeormConn';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/genSchema';

export const server = async () => {
  const Server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
    }),
  });

  Server.express.get('/confirm/:id', confirmEmail);

  await createTypeormConn();
  const app = await Server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
  });
  console.log('🚀  Server is running on localhost:4000');

  return app;
};
