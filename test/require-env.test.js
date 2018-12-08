import requireEnv from '../src/require-env';

test(`Doesn't throw for existing environment variables`, () => {
  expect(() => requireEnv('NODE_ENV')).not.toThrow();
});
test(`Throws for non existing environment variables`, () => {
  expect(() => requireEnv('NOT_A_VAR')).toThrow();
});
test(`Throws for non existing environment variables when some exist`, () => {
  expect(() => requireEnv('NODE_ENV', 'NOT_A_VAR')).toThrow();
});
