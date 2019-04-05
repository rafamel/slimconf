import { IUse, IOfType, TConfig, TFn, TBareConfig } from '~/types';
import full from './full';
import bare from './bare';

export default slim;
function slim<U extends IUse, C extends IOfType<any>>(
  use: U,
  fn: TFn<U, C>
): TConfig<U, C>;
function slim<C extends IOfType<any>>(config: C): TBareConfig<C>;
/**
 * `slim` is the default function exported by `slimconf`
 */
function slim<U extends IUse, C extends IOfType<any>>(
  a: U | C,
  fn?: TFn<U, C>
): TConfig<U, C> | TBareConfig<C> {
  return fn ? full(a as U, fn) : bare(a as C);
}
