import * as flatted from 'flatted';
import * as fs from 'fs';
import { GraphQLServer } from 'graphql-yoga';
import * as path from 'path';
import { redis } from './redis';
import { confirmEmail } from './routes/confirmEmail';
import { createTypeormConn } from './utils/createTypeormConn';
import { genSchema } from './utils/genSchema';

export const server = async () => {
  const apollo = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
    }),
  });

  apollo.express.get('/confirm/:id', confirmEmail);

  await createTypeormConn();

  const options = {
    host: process.env.NODE_ENV === 'production' ? `https://www.app.com:` : `http://127.0.0.1:`,
    port: process.env.NODE_ENV === 'test' ? 0 : 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/graphiql',
  };

  apollo.express.get('/', (req, res, next) => {
    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
      fs.writeFile('logs/req.json', flatted.stringify(req, null, '\t'), 'utf8', err => {
        if (err) throw err;
      });
      let json = fs.createReadStream(path.join(__dirname, '../logs/req.json'));
      json.pipe(res);
    } else {
      return next(new Error('404'));
    }
  });

  const app = await apollo.start(options, ({ port }) =>
    console.log(
      `🚀  Server is running on ${options.host}${port}\n🛰️  Access graphql at ${options.host}${port}${options.endpoint}\n☄️  Access graphql subscriptions at ${options.host}${port}${options.subscriptions}\n🛸  Access graphql playground at ${options.host}${port}${options.playground}`,
    ),
  );

  return app;
};
