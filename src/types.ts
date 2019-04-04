export interface IOfType<T> {
  [key: string]: T;
}

/**
 * Sets up the environment variables the configuration depends on.
 */
export interface ISetup {
  [id: string]: undefined | string | IEnvSetup;
}

/**
 * Used to map an environment variable. As an example, the following setup object maps to `'development'` when there's no `NODE_ENV`:
 * ```javascript
 *  const node: IEnvSetup = {
 *    from: process.env.NODE_ENV,
 *    map: (env) => env === 'production' || env === 'test' ? env : 'development'
 *  };
 * ```
 */
export interface IEnvSetup {
  from: any;
  map: (from?: any) => string | undefined;
}

/**
 * Object with the sames keys as `ISetup`, that is, all the environment variable names the configuration depends on. It is used to define the values for each environment. See `TDefineFn`.
 */
export type TOn<S> = { [P in keyof S]: TDefineFn };

/**
 * Specifies the values for each environment -the `default` key in `IDefinition` will be used if no specific value for an environment was specified. Optionally, you can also specify a merging rule as a first argument.
 */
export type TDefineFn = ((definition: IDefinition) => any) &
  ((rule: TRule, definition: IDefinition) => any);

/**
 * Used for object merging when both defaults and value exist. It can be passed as a first argument to `TDefineFn`. It is implemented by `rules`.
 */
export type TRule = (defaults: any, value: any) => any;

/**
 * See `TDefineFn`.
 */
export interface IDefinition {
  [id: string]: any;
  default?: any;
}

/**
 * A configuration object returning function, receiving the values of each environment variable as a first argument, and a `ISelect` object as a second.
 */
export type TFn<S, C> = (envs: { [P in keyof S]: string }, on: TOn<S>) => C;

export interface IBareConfig<C> {
  /**
   * Returns the value at `path` for the current environment, if it exists -otherwise it will throw. Example: `config.get('logs.transports')`.
   */
  get: (path: string) => any;
  /**
   * Sets and returns the value at `path` for the current environment, if it exists -otherwise it will throw. Example: `config.set('logs.transports', { console: false, file: false })`.
   */
  set: <T>(path: string, value: T) => T;
  /**
   * Returns the configuration object for the current environment without any of `IBareConfig` / `IConfig` methods.
   */
  pure: () => C;
}

/**
 * The configuration object with additional methods - see `IBareConfig`.
 */
export type TBareConfig<C> = { [P in keyof C]: C[P] } & IBareConfig<C>;

export interface IConfig<S, C> extends IBareConfig<C> {
  /**
   * Returns the configuration for a specific environment that might not be the current. As an example, we could access the configuration for a production environment when in a development environment via `obj.environment({ env: 'production' })`.
   */
  environment: (assign?: TEnvAssign<S>) => TConfig<S, C>;
}

/**
 * The configuration object with additional methods - see `IConfig`.
 */
export type TConfig<S, C> = { [P in keyof C]: C[P] } & IConfig<S, C>;

export type TEnvAssign<S> = { [P in keyof S]?: string };
