/**
 * Returns the value at `path` for an object `obj`, if it exists and it's defined -otherwise it will throw. If `unsafe` is `true`, it won't throw when the key exists but the value is `undefined`.
 */
export default function get(obj: any, path: string, unsafe?: boolean): any {
  if (typeof obj !== 'object') throw Error(`get must be called with an object`);
  if (!path) throw Error(`get must be called with a path`);

  const value = trunk(obj, path.split('.'));
  if (!unsafe && value === undefined) {
    throw Error(`path ${path} is undefined`);
  }

  return value;
}

export function trunk(obj: any, strArr: string[]): any {
  const str = String(strArr.shift());
  if (Object.hasOwnProperty.call(obj, str)) {
    return strArr.length ? trunk(obj[str], strArr) : obj[str];
  }
  throw Error(`key ${str} doesn't exist`);
}
