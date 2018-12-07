/**
 * @module slimconf
 */

interface EnvSetup {
  default: any;
  map: (any) => any;
}

interface Setup {
  [id: string]: string | EnvSetup;
}

interface EnvObj {
  [id: string]: any;
}

interface EnvConfig {
  [id: string]: any;
  default?: any;
}

interface On {
  [id: string]: (envConfig: EnvConfig) => any;
}

type ConfigCb = (envObj: EnvObj, on: On) => void;

export default function config(
  setup?: void | Setup,
  configCb: ConfigCb
): object;

export function requireEnv(arr: string[]): void;
