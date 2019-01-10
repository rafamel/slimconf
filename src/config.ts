import { ISetup, IEnv, IOn, IConfig } from './types';

export default function config(
  setup: void | null | ISetup,
  callback: (envObj: IEnv, on: IOn) => void
): IConfig {
  function environment(obj: IEnv) {
    const valuesObj = setupKeys.reduce((acc: any, key) => {
      // prettier-ignore
      const map =
        setup &&
        typeof setup[key] === 'object' && 
        // @ts-ignore
        setup[key].hasOwnProperty('map') ? setup[key].map : (x: any) => x;
      acc[key] = map(obj[key]);
      return acc;
    }, {});
    const id = setupKeys.reduce((acc, key) => acc + key + valuesObj[key], '');
    if (!environments.hasOwnProperty(id)) {
      const configObj: any = callback(valuesObj, createOn(valuesObj));
      if (
        configObj.hasOwnProperty('get') ||
        configObj.hasOwnProperty('set') ||
        configObj.hasOwnProperty('environment')
      ) {
        throw Error(
          'slimconfig config can\'t have keys "get", "set", or "environment"'
        );
      }
      environments[id] = {
        ...configObj,
        get(path: string): any {
          return get(this, path.split('.'));
        },
        set<T>(path: string, value: T): T {
          return set(this, path.split('.'), value);
        },
        environment(o: IEnv): IConfig {
          if (!o) return environment(initial);

          return environment(
            setupKeys.reduce((acc: any, key) => {
              acc[key] = o.hasOwnProperty(key) ? o[key] : initial[key];
              return acc;
            }, {})
          );
        }
      };
    }

    return environments[id];
  }

  const environments: { [id: string]: IConfig } = {};
  if (!setup) setup = {};
  const setupKeys = Object.keys(setup).sort();
  const initial: { [id: string]: any } = Object.entries(setup).reduce(
    (acc: any, [key, value]) => {
      acc[key] = typeof value === 'object' ? value.default : value;
      return acc;
    },
    {}
  );
  return environment(initial);
}

function createOn(valuesObj: any): IOn {
  return Object.entries(valuesObj).reduce((acc: any, [key, value]) => {
    acc[key] = function environment(obj: any) {
      const val = String(value);
      if (!obj.hasOwnProperty(val)) return obj.default;

      if (typeof obj[val] === 'object' && !Array.isArray(obj[val])) {
        return { ...obj.default, ...obj[val] };
      }
      return obj[val];
    };
    return acc;
  }, {});
}

function get(obj: any, strArr: string[]): any {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? get(obj[str], strArr) : obj[str];
  }
  throw Error(`config key ${str} doesn't exist.`);
}

function set(obj: any, strArr: string[], value: any): any {
  const str = String(strArr.shift());
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? set(obj[str], strArr, value) : (obj[str] = value);
  }
  throw Error(`config key ${str} doesn't exist.`);
}
