export interface IEnvSetup {
  default: any;
  map: (o: any) => any;
}

export interface ISetup {
  [id: string]: string | IEnvSetup;
}

export interface IEnv {
  [id: string]: any;
}

export interface IEnvConfig {
  [id: string]: any;
  default?: any;
}

export interface IOn {
  [id: string]: (envConfig: IEnvConfig) => any;
}

export interface IConfig {
  environment: (o: IEnv) => IConfig;
  get: (path: string) => any;
  set: <T>(path: string, value: T) => T;
  pure: () => { [id: string]: any };
  [id: string]: any;
}
