import { request } from 'graphql-request';

import { User } from '../entity/User';
import { createTypeormConn } from '../utils/createTypeormConn';

const host = 'http://localhost:4000';
const email = 'tom@bob.com';
const password = 'jalksdf';

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test('Register user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  await createTypeormConn();
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
