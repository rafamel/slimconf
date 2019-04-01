import { ISetup, IOfType, TConfig, TEnvFilter, TFn } from '~/types';
import environment from './environment';

export default function slim<S extends ISetup, C extends IOfType<any>>(
  setup: S,
  fn: TFn<S, C>
): TConfig<S, C> {
  if (!setup) setup = {} as S;
  const environments: IOfType<TConfig<S, C>> = {};
  const initial: TEnvFilter<S> = Object.entries(setup).reduce(
    (acc: TEnvFilter<S>, [key, value]) => {
      acc[key] = typeof value === 'object' ? value.default : value;
      return acc;
    },
    {}
  );
  return environment(environments, initial, initial, setup, fn);
}
