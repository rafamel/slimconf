import { ISetup, IOfType, TConfig, TFn, TBareConfig } from '~/types';
import full from './full';
import bare from './bare';

export default slim;
function slim<S extends ISetup, C extends IOfType<any>>(
  setup: S,
  fn: TFn<S, C>
): TConfig<S, C>;
function slim<C extends IOfType<any>>(config: C): TBareConfig<C>;
/**
 * `slim` is the default function exported by `slimconf`
 */
function slim<S extends ISetup, C extends IOfType<any>>(
  a: S | C,
  fn?: TFn<S, C>
): TConfig<S, C> | TBareConfig<C> {
  return fn ? full(a as S, fn) : bare(a as C);
}
