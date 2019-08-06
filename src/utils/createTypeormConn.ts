import { createConnection } from 'net';
import { getConnectionOptions } from 'typeorm';

export const createTypeormConn = async () => {
  const connectionType = process.env.NODE_ENV;
  console.log(connectionType);
  const connectionOptions: any = await getConnectionOptions(
    process.env.NODE_ENV,
  );
  return createConnection(connectionOptions);
};
