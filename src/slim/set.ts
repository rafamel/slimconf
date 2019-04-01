export default function set<T>(obj: any, path: string, value: T): T {
  if (!path) throw Error(`set must be called with a path`);
  return trunk(obj, path.split('.'), value);
}

export function trunk<T>(obj: any, strArr: string[], value: T): T {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? trunk(obj[str], strArr, value) : (obj[str] = value);
  }
  throw Error(`config key ${str} doesn't exist.`);
}
