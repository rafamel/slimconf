import { IOfType, TBareConfig } from '~/types';
import get from './get';
import set from './set';
import verify from './verify';

export default function bare<C extends IOfType<any>>(
  config: C
): TBareConfig<C> {
  verify(config);
  return Object.assign({}, config, {
    get(path: string, unsafe?: boolean): any {
      return get(this, path, unsafe);
    },
    set<T>(path: string, value: T): T {
      return set(this, path, value);
    },
    pure(this: TBareConfig<C>): C {
      const o = Object.assign({}, this);
      delete o.get;
      delete o.set;
      delete o.pure;
      return o;
    }
  });
}
