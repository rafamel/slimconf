import { IOfType } from '~/types';

const PROTECTED = ['get', 'set', 'pure', 'environment'];

export default function verify(obj: IOfType<any>): void {
  for (const key of PROTECTED) {
    if (Object.hasOwnProperty.call(obj, key)) {
      throw Error(
        `config can't have key "${key}" -these are protected: ` +
          PROTECTED.join(', ')
      );
    }
  }
}
