/* eslint-disable @typescript-eslint/explicit-function-return-type */
import isequal from 'lodash.isequal';

/**
 * Returns a function taking and returning a `value` -if it's not defined, it will return `fallback`. If an `allow` array is passed, the retuned function will only return `value` if it's found in the array -returning `fallback` otherwise. If `deep` is true, it'll check for deep equality between `value` and `allow` array values -instead of shallow.
 */
export default function fallback<T, U>(
  fallback: T,
  allow?: U[],
  deep: boolean = false
) {
  return (value?: T | U): T | U => {
    if (allow) {
      for (const allowed of allow) {
        if (deep ? isequal(allowed, value) : allowed === value) {
          return value as T | U;
        }
      }
      return fallback;
    } else {
      return value === undefined ? fallback : value;
    }
  };
}
