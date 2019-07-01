import { IUse, IOfType, TConfig, TEnvAssign, TFn } from '~/types';
import environment from './environment';

export default function full<U extends IUse, C extends IOfType<any>>(
  use: U,
  fn: TFn<U, C>
): TConfig<U, C> {
  const environments: IOfType<TConfig<U, C>> = {};
  const initial: TEnvAssign<U> = Object.entries(use).reduce(
    (acc: TEnvAssign<U>, [key, value]) => {
      acc[key as keyof U] = Array.isArray(value) ? value[0] : value;
      return acc;
    },
    {}
  );
  return environment(environments, initial, initial, use, fn);
}
