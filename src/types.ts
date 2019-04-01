export interface IOfType<T> {
  [key: string]: T;
}

export interface ISetup {
  [id: string]: undefined | string | IEnvSetup;
}

export interface IEnvSetup {
  from: any;
  map: (from?: any) => string | undefined;
}

export type TOn<S> = { [P in keyof S]: (each: IEnvEach) => any };

export interface IEnvEach {
  [id: string]: any;
  default?: any;
}

export type TFn<S, C> = (envs: { [P in keyof S]: string }, on: TOn<S>) => C;

export interface IBareConfig<C> {
  get: (path: string) => any;

  set: <T>(path: string, value: T) => T;

  pure: () => C;
}

export type TBareConfig<C> = { [P in keyof C]: C[P] } & IBareConfig<C>;

export interface IConfig<S, C> extends IBareConfig<C> {
  environment: (filter?: TEnvFilter<S>) => TConfig<S, C>;
}

export type TConfig<S, C> = { [P in keyof C]: C[P] } & IConfig<S, C>;

export type TEnvFilter<S> = { [P in keyof S]?: string };
