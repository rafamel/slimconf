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
describe(`bool`, () => {
  test(`false`, () => {
    expect(envs.bool('BOOL_ENV_VAR')).toBe(false);
    process.env.BOOL_ENV_VAR = '';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(false);
    process.env.BOOL_ENV_VAR = '0';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(false);
    process.env.BOOL_ENV_VAR = 'false';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(false);
    process.env.BOOL_ENV_VAR = 'FALSE';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(false);
  });
  test(`true`, () => {
    process.env.BOOL_ENV_VAR = '1';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(true);
    process.env.BOOL_ENV_VAR = 'true';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(true);
    process.env.BOOL_ENV_VAR = 'TRUE';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(true);
    process.env.BOOL_ENV_VAR = 'random';
    expect(envs.bool('BOOL_ENV_VAR')).toBe(true);
  });
});
