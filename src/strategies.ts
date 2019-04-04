import mergewith from 'lodash.mergewith';

/**
 * If both the default value and the value for the environment are objects, they will be shallow merged.
 */
export function shallow<T>(defaults: any, value: T): T {
  return typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof defaults === 'object' &&
    !Array.isArray(defaults)
    ? Object.assign({}, defaults, value)
    : value;
}

/**
 * If both the default value and the value for the environment are objects, they will be deep merged. Arrays won't be merged.
 */
export function merge<T>(defaults: any, value: T): T {
  return mergewith({ data: defaults }, { data: value }, (obj: any, src: any) =>
    Array.isArray(src) || Array.isArray(obj) ? src : undefined
  ).data;
}

/**
 * If both the default value and the value for the environment are objects, they will be deep merged. Arrays will be merged using concatenation.
 */
export function deep<T>(defaults: any, value: T): T {
  return mergewith(
    { data: defaults },
    { data: value },
    (obj: any, src: any) => {
      const a = Array.isArray(obj);
      const b = Array.isArray(src);
      if (!a && !b) return;
      return a && b ? obj.concat(src) : src;
    }
  ).data;
}
