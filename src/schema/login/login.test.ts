import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { confirmEmailError, invalidLogin } from './errorMessages';

const email = 'sam@samlazrak.com';
const password = 'testtestest';

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createTypeormConn();
});

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(process.env.TEST_HOST as string, loginMutation(e, p));

  expect(response).toEqual({
    login: [
      {
        path: 'email',
        message: errMsg,
      },
    ],
  });
};

describe('login', () => {
  test('email not found send back error', async () => {
    await loginExpectError('bob@bob.com', 'whatever', invalidLogin);
  });

  test('email not confirmed', async () => {
    await request(process.env.TEST_HOST as string, registerMutation(email, password));

    await loginExpectError(email, password, confirmEmailError);
    // @ts-ignore
    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, 'aslkdfjaksdljf', invalidLogin);

    const response = await request(process.env.TEST_HOST as string, loginMutation(email, password));

    expect(response).toEqual({ login: null });
  });
});
