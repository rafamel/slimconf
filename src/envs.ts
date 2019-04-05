// import { IEnvs } from './types';

const envs = { assert, constrain, get };
export default envs;

/**
 * Requires any number of environment variables to be defined; throws otherwise.
 */
function assert(...arr: string[]): typeof envs {
  arr.forEach((src) => get(src));
  return envs;
}

/**
 * Requires environment variable `src` to be defined, throwing otherwise. If an array of allowed `values` are passed the value will be checked against them, throwing if its not contained in the array.
 */
function constrain(
  src: string,
  values?: Array<string | undefined>
): typeof envs {
  get(src, values);
  return envs;
}

function get(src: string, values?: string[]): string;
function get(
  src: string,
  values?: Array<string | undefined>
): string | undefined;
/**
 * Same as `constrain`, but it returns the environment variable `src` -so it's not chainable.
 */
function get(src: string, values?: Array<string | undefined>): any {
  const value = process.env[src];
  if (values) {
    if (!values.includes(value)) {
      throw Error(
        `Environment variable ${src} should be one of: ${values.join(', ')}`
      );
    }
  } else {
    if (value === undefined) {
      throw Error(`Environment variable ${src} should be defined`);
    }
  }
  return value;
}
