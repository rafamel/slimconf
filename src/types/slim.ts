/**
 * Sets up the environment variables the configuration depends on.
 */
export interface IUse {
  [id: string]: string | undefined | TUseMap;
}

/**
 * Environment variable with default value and mapping for `IUse`. Using maps this way will allow for the map to also apply when using `TConfig.environment()`,
 */
export type TUseMap = [
  string | undefined,
  (value?: string) => string | undefined
];

/**
 * Object with the sames keys as `IUse`, that is, all the environment variable names the configuration depends on. It is used to define the values for each environment. See `TDefineFn`.
 */
export type TOn<U> = { [P in keyof U]: TDefineFn };

/**
 * Specifies the values for each environment -the `defaults` key in `IDefinition` will be used if no specific value for an environment was specified. Optionally, you can also specify a merging strategy as a first argument.
 */
export type TDefineFn = ((definition: IDefinition) => any) &
  ((strategy: TStrategy, definition: IDefinition) => any);

/**
 * Used for object merging when both defaults and a value for an environment exist. It can be passed as a first argument to `TDefineFn`. See `shallow`, `merge`, and `deep` for a set of available strategies.
 */
export type TStrategy = (defaults: any, value: any) => any;

/**
 * See `TDefineFn`.
 */
export interface IDefinition {
  [id: string]: any;
  defaults?: any;
}

/**
 * A configuration object returning function, receiving a `TOn` object as the first argument, and the values for the environment variables as the second.
 */
export type TFn<U, C> = (
  on: TOn<U>,
  vars: { [P in keyof U]: string | undefined }
) => C;

export interface IBareConfig<C> {
  /**
   * Returns the value at `path` for the current environment, if it exists and it's defined -otherwise it will throw. If `unsafe` is `true`, it won't throw when the key exists but the value is `undefined`. Example: `config.get('logs.transports')`.
   */
  get: (path: string, unsafe?: boolean) => any;
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

export interface IConfig<U, C> extends IBareConfig<C> {
  /**
   * Returns the configuration for a specific environment that might not be the current. As an example, we could access the configuration for a production environment when in a development environment via `obj.environment({ env: 'production' })`.
   */
  environment: (assign?: TEnvAssign<U>) => TConfig<U, C>;
}

/**
 * The configuration object with additional methods - see `IConfig`.
 */
export type TConfig<U, C> = { [P in keyof C]: C[P] } & IConfig<U, C>;

export type TEnvAssign<U> = { [P in keyof U]?: string };
