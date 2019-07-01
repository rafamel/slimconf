import { shallow, merge, deep } from 'merge-strategies';
import hash from './hash';
import { get, set } from '~/utils';
import verify from '../verify';
import {
  TEnvAssign,
  IUse,
  TFn,
  IOfType,
  TConfig,
  IDefinition,
  TStrategy,
  TDefineFn,
  TOn,
  TUseType
} from '~/types';

export default function environment<U extends IUse, C extends IOfType<any>>(
  environments: IOfType<TConfig<U, C>>,
  initial: TEnvAssign<U>,
  assign: TEnvAssign<U>,
  use: U,
  fn: TFn<U, C>
): TConfig<U, C> {
  assign = initial === assign ? initial : Object.assign({}, initial, assign);

  const vars = Object.keys(assign).reduce(
    (acc: { [P in keyof U]?: TUseType }, key: keyof TEnvAssign<U>) => {
      const value = use[key];
      const map =
        Array.isArray(value) && value[1] ? value[1] : (x?: TUseType) => x;
      acc[key] = map(assign[key]);
      return acc;
    },
    {}
  ) as { [P in keyof U]: TUseType };

  const id = hash(vars);
  if (!environments.hasOwnProperty(id)) {
    create(id, vars, environments, initial, use, fn);
  }

  return environments[id];
}

export function create<U extends IUse, C extends IOfType<any>>(
  id: string,
  vars: { [P in keyof U]: TUseType },
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
  vars: { [P in keyof U]: TUseType }
): TOn<U> {
  return Object.entries(vars).reduce(
    (acc: TOn<U>, [key, val]: [keyof U, TUseType]) => {
      const value = val === undefined ? val : String(val);
      const fn: TDefineFn = function(
        a: TStrategy | IDefinition,
        b?: IDefinition
      ): any {
        const strategy = !b ? (_: any, val: any) => val : (a as TStrategy);
        const obj = b || (a as IDefinition);

        if (value === undefined || !obj.hasOwnProperty(value)) {
          return obj.defaults;
        }
        if (!obj.hasOwnProperty('defaults')) return obj[value];
        if (typeof strategy === 'string') {
          switch (strategy) {
            case 'shallow':
              return shallow(obj.defaults, obj[value]);
            case 'merge':
              return merge(obj.defaults, obj[value]);
            case 'deep':
              return deep(obj.defaults, obj[value]);
            default:
              throw Error(`Strategy "${strategy}" doesn't exist`);
          }
        } else {
          return strategy(obj.defaults, obj[value]);
        }
      };

      acc[key] = fn;
      return acc;
    },
    {} as TOn<U>
  );
}
