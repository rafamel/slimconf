/**
 * Sets and returns the value at `path` for an object `obj`, if it exists -otherwise it will throw.
 */
export default function set<T>(obj: any, path: string, value: T): T {
  if (typeof obj !== 'object') throw Error(`set must be called with an object`);
  if (!path) throw Error(`set must be called with a path`);
  return trunk(obj, path.split('.'), value);
}

/** @hidden */
export function trunk<T>(obj: any, strArr: string[], value: T): T {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? trunk(obj[str], strArr, value) : (obj[str] = value);
  }
  throw Error(`key ${str} doesn't exist`);
}
