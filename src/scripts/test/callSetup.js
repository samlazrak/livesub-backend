require('ts-node/register');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setup } = require('./setup');

module.exports = async function() {
  if (!process.env.TEST_HOST) {
    await setup();
  }
  return null;
};
