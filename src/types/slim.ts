/**
 * Sets up the environment variables the configuration depends on.
 */
export interface IUse {
  [id: string]: TUseType | TUseMap;
}

/**
 * Environment variable with default value and mapping for `IUse`. Using maps this way will allow for the map to also apply when using `TConfig.environment()`,
 */
export type TUseMap = [any, (value?: any) => TUseType];

/**
 * Types that can be used on `IUse` and `TUseMap`. All but `undefined` will map to their *string* equivalent for `IDefinition` -`true` will recover the `'true'` property, if it exists, and so on. See `TOn` and `TDefineFn`.
 */
export type TUseType = string | number | boolean | null | undefined;

/**
 * Object with the sames keys as `IUse`, that is, all the environment variable names the configuration depends on. It is used to define the values for each environment. See `TDefineFn`.
 */
export type TOn<U> = { [P in keyof U]: TDefineFn };

/**
 * Specifies the values for each environment -the `default` key in `IDefinition` will be used if no specific value for an environment was specified. Optionally, you can also specify a merging strategy as a first argument.
 */
export type TDefineFn = ((definition: IDefinition) => any) &
  ((strategy: TStrategy, definition: IDefinition) => any);

/**
 * Used for object merging when both a default and a value for an environment exist. It can be passed as a first argument to `TDefineFn`. It should be either one of the preset strategies (`'shallow'`, `'merge'`, `'deep'`) or a `TStrategyFn` function. See [`merge-strategies`](https://www.npmjs.com/package/merge-strategies) for further details on the preset strategies.
 */
export type TStrategy = 'shallow' | 'merge' | 'deep' | TStrategyFn;

/**
 * A `TStrategy` as a function. It should take any two values as arguments, and return a result.
 */
export type TStrategyFn = (a: any, b: any) => any;

/**
 * See `TDefineFn`.
 */
export interface IDefinition {
  [id: string]: any;
  default?: any;
}

/**
 * A configuration object returning function, receiving a `TOn` object as the first argument, and the values for the environment variables as the second.
 */
export type TFn<U, C> = (on: TOn<U>, vars: { [P in keyof U]: TUseType }) => C;

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

export type TEnvAssign<U> = { [P in keyof U]?: TUseType };
