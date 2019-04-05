import envs from '~/utils/envs';

describe(`assert`, () => {
  test(`Doesn't throw for existing environment variables`, () => {
    expect(() => envs.assert('NODE_ENV', 'NODE_ENV')).not.toThrow();
  });
  test(`Throws for non existing environment variables`, () => {
    expect(() => envs.assert('NOT_A_VAR')).toThrow();
  });
  test(`Throws for non existing environment variables when some exist`, () => {
    expect(() => envs.assert('NODE_ENV', 'NOT_A_VAR')).toThrow();
  });
});
describe(`constrain`, () => {
  test(`succeeds wo/ values`, () => {
    expect(() => envs.constrain('NODE_ENV')).not.toThrow();
  });
  test(`fails wo/ values`, () => {
    expect(() => envs.constrain('NOT_A_VAR')).toThrowError();
  });
  test(`succeeds w/ values`, () => {
    expect(() => envs.constrain('NODE_ENV', ['foo', 'test'])).not.toThrow();
  });
  test(`fails w/ values`, () => {
    expect(() => envs.constrain('NODE_ENV', ['foo', 'bar'])).toThrowError();
  });
});
