import { IEnvs } from '~/types';

const envs: IEnvs = { assert, constrain, get, bool };
export default envs;

function assert(...arr: string[]): IEnvs {
  arr.forEach((src) => get(src));
  return envs;
}

function constrain(src: string, values?: Array<string | undefined>): IEnvs {
  get(src, values);
  return envs;
}

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

function bool(src: string): boolean {
  const value = process.env[src];

  return Boolean(value && value !== '0' && value.toLowerCase() !== 'false');
}
