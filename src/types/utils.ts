export interface IOfType<T> {
  [key: string]: T;
}

export interface IEnvs {
  /**
   * Requires any number of environment variables to be defined; throws otherwise.
   */
  assert(...arr: string[]): IEnvs;
  /**
   * Requires environment variable `src` to be defined, throwing otherwise. If an array of allowed `values` are passed the value will be checked against them, throwing if its not contained in the array.
   */
  constrain(src: string, values?: Array<string | undefined>): IEnvs;
  /**
   * Same as `constrain`, but it returns the environment variable `src` -so it's not chainable.
   */
  get(src: string, values?: string[]): string;
  get(src: string, values?: Array<string | undefined>): string | undefined;
  /**
   * It will obtain the environment variable `src` and return `false` if it's `undefined`, an empty string, `'0'`, or `'false'` (case insensitive); `true` otherwise.
   */
  bool(src: string): boolean;
}
