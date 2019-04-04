import mergewith from 'lodash.mergewith';

const rules = {
  /**
   * If a value exists for the environment, it is selected and not merged at all. This rule is applied by default.
   */
  rank(_: any, value: any): any {
    return value;
  },
  /**
   * If both the default value and the value for the environment are objects, they will be shallow merged.
   */
  shallow(defaults: any, value: any): any {
    return typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof defaults === 'object' &&
      !Array.isArray(defaults)
      ? Object.assign({}, defaults, value)
      : value;
  },
  /**
   * If both the default value and the value for the environment are objects, they will be deep merged. Arrays won't be merged.
   */
  merge(defaults: any, value: any): any {
    return mergewith({ top: defaults }, { top: value }, (obj: any, src: any) =>
      Array.isArray(src) || Array.isArray(obj) ? src : undefined
    ).top;
  },
  /**
   * If both the default value and the value for the environment are objects, they will be deep merged. Arrays will be merged using concatenation.
   */
  deep(defaults: any, value: any): any {
    return mergewith(
      { top: defaults },
      { top: value },
      (obj: any, src: any) => {
        const a = Array.isArray(obj);
        const b = Array.isArray(src);
        if (!a && !b) return;
        return a && b ? obj.concat(src) : src;
      }
    ).top;
  }
};

export default rules;
