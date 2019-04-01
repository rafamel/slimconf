export default function get(obj: any, path: string): any {
  if (!path) throw Error(`get must be called with a path`);
  return trunk(obj, path.split('.'));
}

export function trunk(obj: any, strArr: string[]): any {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? trunk(obj[str], strArr) : obj[str];
  }
  throw Error(`config key ${str} doesn't exist.`);
}
