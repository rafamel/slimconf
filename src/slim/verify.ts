import { IOfType } from '~/types';

const PROTECTED = ['get', 'set', 'pure', 'environment'];

export default function verify(obj: IOfType<any>): void {
  for (let key of PROTECTED) {
    if (obj.hasOwnProperty(key)) {
      throw Error(
        `config can't have key "${key}" -these are protected: ` +
          PROTECTED.join(', ')
      );
    }
  }
}
