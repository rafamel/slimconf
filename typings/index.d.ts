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

interface ConfigObj {
  [prop: any]: any;
  get: (any) => any;
  set: (any) => any;
  environment: (envObj: EnvObj) => ConfigObj;
}

export default function config(
  setup?: void | Setup,
  configCb: ConfigCb
): ConfigObj;

export function requireEnv(...vars: string[]): void;
