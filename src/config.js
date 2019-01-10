export default function config(setup, callback) {
  function environment(obj) {
    const valuesObj = setupKeys.reduce((acc, key) => {
      const map =
        typeof setup[key] !== 'string' && setup[key].hasOwnProperty('map')
          ? setup[key].map
          : (x) => x;
      acc[key] = map(obj[key]);
      return acc;
    }, {});
    const id = setupKeys.reduce((acc, key) => acc + key + valuesObj[key], '');
    if (!environments.hasOwnProperty(id)) {
      const configObj = callback(valuesObj, createOn(valuesObj));
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
        get(str) {
          return get(this, str.split('.'));
        },
        set(str, value) {
          return set(this, str.split('.'), value);
        },
        environment(obj) {
          if (!obj) return environment(initial);

          return environment(
            setupKeys.reduce((acc, key) => {
              acc[key] = obj.hasOwnProperty(key) ? obj[key] : initial[key];
              return acc;
            }, {})
          );
        }
      };
    }

    return environments[id];
  }

  const environments = {};
  if (!setup) setup = {};
  const setupKeys = Object.keys(setup).sort();
  const initial = Object.entries(setup).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'object' ? value.default : value;
    return acc;
  }, {});
  return environment(initial);
}

function createOn(valuesObj) {
  return Object.entries(valuesObj).reduce((acc, [key, value]) => {
    acc[key] = function environment(obj) {
      if (!obj.hasOwnProperty(value)) return obj.default;

      if (typeof obj[value] === 'object' && !Array.isArray(obj[value])) {
        return { ...obj.default, ...obj[value] };
      }
      return obj[value];
    };
    return acc;
  }, {});
}

function get(obj, strArr) {
  const str = strArr.shift();
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? get(obj[str], strArr) : obj[str];
  }
  throw Error(`config key ${str} doesn't exist.`);
}

function set(obj, strArr, value) {
  const str = strArr.shift();
  if (obj.hasOwnProperty(str)) {
    return strArr.length ? set(obj[str], strArr, value) : (obj[str] = value);
  }
  throw Error(`config key ${str} doesn't exist.`);
}
