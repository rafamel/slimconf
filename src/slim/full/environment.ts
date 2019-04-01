import { TEnvAssign, ISetup, TFn, IOfType, TOn, TConfig } from '~/types';
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

  const envs = keys.reduce((acc: { [P in keyof S]?: string }, key: string) => {
    const value = setup[key];
    const map =
      typeof value === 'object' && value.map ? value.map : (x?: string) => x;
    const env = map(assign[key]);
    // eslint-disable-next-line eqeqeq
    acc[key] = env == undefined ? 'default' : env;
    return acc;
  }, {}) as { [P in keyof S]: string };

  const id = hash(envs);
  if (!environments.hasOwnProperty(id)) {
    create(id, envs, environments, initial, setup, fn);
  }

  return environments[id];
}

export function create<S extends ISetup, C extends IOfType<any>>(
  id: string,
  envs: { [P in keyof S]: string },
  environments: any,
  initial: TEnvAssign<S>,
  setup: S,
  fn: TFn<S, C>
): void {
  const configObj: any = fn(envs, on(envs));
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

export function on<T extends IOfType<string>>(envs: T): TOn<T> {
  return Object.entries(envs).reduce((acc: any, [key, value]) => {
    acc[key] = function on(obj: any) {
      if (!obj.hasOwnProperty(value)) return obj.default;

      if (typeof obj[value] === 'object' && !Array.isArray(obj[value])) {
        return { ...obj.default, ...obj[value] };
      }
      return obj[value];
    };
    return acc;
  }, {});
}