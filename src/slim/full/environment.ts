import {
  TEnvAssign,
  ISetup,
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

export default function environment<S extends ISetup, C extends IOfType<any>>(
  environments: IOfType<TConfig<S, C>>,
  initial: TEnvAssign<S>,
  assign: TEnvAssign<S>,
  setup: S,
  fn: TFn<S, C>
): TConfig<S, C> {
  assign = initial === assign ? initial : Object.assign({}, initial, assign);
  const keys = Object.keys(setup);

  const vars = keys.reduce((acc: { [P in keyof S]?: string }, key: string) => {
    const value = setup[key];
    const map =
      typeof value === 'object' && value.map ? value.map : (x?: string) => x;
    const env = map(assign[key]);
    // eslint-disable-next-line eqeqeq
    acc[key] = env == undefined ? 'defaults' : env;
    return acc;
  }, {}) as { [P in keyof S]: string };

  const id = hash(vars);
  if (!environments.hasOwnProperty(id)) {
    create(id, vars, environments, initial, setup, fn);
  }

  return environments[id];
}

export function create<S extends ISetup, C extends IOfType<any>>(
  id: string,
  vars: { [P in keyof S]: string },
  environments: any,
  initial: TEnvAssign<S>,
  setup: S,
  fn: TFn<S, C>
): void {
  const configObj: any = fn(makeOn(vars), vars);
  verify(configObj);

  environments[id] = Object.assign({}, configObj, {
    get(path: string): any {
      return get(this, path);
    },
    set<T>(path: string, value: T): T {
      return set(this, path, value);
    },
    pure(this: TConfig<S, C>): C {
      const o = Object.assign({}, this);
      delete o.get;
      delete o.set;
      delete o.pure;
      delete o.environment;
      return o;
    },
    environment(assign?: TEnvAssign<S>): TConfig<S, C> {
      return environment(environments, initial, assign || initial, setup, fn);
    }
  });
}

export function makeOn<S extends ISetup>(
  vars: { [P in keyof S]: string }
): TOn<S> {
  return Object.entries(vars).reduce(
    (acc: TOn<S>, [key, val]) => {
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
    {} as TOn<S>
  );
}
