import { ISetup, IOfType, TConfig, TEnvAssign, TFn } from '~/types';
import environment from './environment';

export default function full<S extends ISetup, C extends IOfType<any>>(
  setup: S,
  fn: TFn<S, C>
): TConfig<S, C> {
  const environments: IOfType<TConfig<S, C>> = {};
  const initial: TEnvAssign<S> = Object.entries(setup).reduce(
    (acc: TEnvAssign<S>, [key, value]) => {
      acc[key] = typeof value === 'object' ? value.from : value;
      return acc;
    },
    {}
  );
  return environment(environments, initial, initial, setup, fn);
}
