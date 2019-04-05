import {
  TEnvAssign,
  IUse,
  TFn,
  IOfType,
  TConfig,
  IDefinition,
  TStrategy,
  TDefineFn,
  TOn
} from '~/types';
import hash from './hash';
import get from '../get';
import set from '../set';
import verify from '../verify';

export default function environment<U extends IUse, C extends IOfType<any>>(
  environments: IOfType<TConfig<U, C>>,
  initial: TEnvAssign<U>,
  assign: TEnvAssign<U>,
  use: U,
  fn: TFn<U, C>
): TConfig<U, C> {
  assign = initial === assign ? initial : Object.assign({}, initial, assign);

  const keys = Object.keys(assign);
  const vars = keys.reduce((acc: { [P in keyof U]?: string }, key: string) => {
    const value = use[key];
    const map = Array.isArray(value) && value[1] ? value[1] : (x?: string) => x;
    acc[key] = map(assign[key]);
    return acc;
  }, {}) as { [P in keyof U]: string };

  const id = hash(vars);
  if (!environments.hasOwnProperty(id)) {
    create(id, vars, environments, initial, use, fn);
  }

  return environments[id];
}

export function create<U extends IUse, C extends IOfType<any>>(
  id: string,
  vars: { [P in keyof U]: string },
  environments: any,
  initial: TEnvAssign<U>,
  use: U,
  fn: TFn<U, C>
): void {
  const configObj: any = fn(makeOn(vars), vars);
  verify(configObj);

  environments[id] = Object.assign({}, configObj, {
    get(path: string, unsafe?: boolean): any {
      return get(this, path, unsafe);
    },
    set<T>(path: string, value: T): T {
      return set(this, path, value);
    },
    pure(this: TConfig<U, C>): C {
      const o = Object.assign({}, this);
      delete o.get;
      delete o.set;
      delete o.pure;
      delete o.environment;
      return o;
    },
    environment(assign?: TEnvAssign<U>): TConfig<U, C> {
      return environment(environments, initial, assign || initial, use, fn);
    }
  });
}

export function makeOn<U extends IUse>(
  vars: { [P in keyof U]: string }
): TOn<U> {
  return Object.entries(vars).reduce(
    (acc: TOn<U>, [key, val]) => {
      const fn: TDefineFn = function(
        a: TStrategy | IDefinition,
        b?: IDefinition
      ): any {
        const strategy = b ? (a as TStrategy) : (_: any, val: any) => val;
        const obj = b || (a as IDefinition);
        if (!obj.hasOwnProperty(val)) return obj.defaults;
        if (!obj.hasOwnProperty('defaults')) return obj[val];
        return strategy(obj.defaults, obj[val]);
      };

      acc[key] = fn;
      return acc;
    },
    {} as TOn<U>
  );
}
