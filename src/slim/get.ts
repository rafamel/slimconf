export default function get(obj: any, path: string, unsafe?: boolean): any {
  if (!path) throw Error(`get must be called with a path`);

  const value = trunk(obj, path.split('.'));
  if (!unsafe && value === undefined) {
    throw Error(`path ${path} is undefined`);
  }

  return value;
}

export function trunk(obj: any, strArr: string[]): any {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? trunk(obj[str], strArr) : obj[str];
  }
  throw Error(`config key ${str} doesn't exist`);
}
