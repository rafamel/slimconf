import { IOfType } from '~/types';

export default function verify(obj: IOfType<any>): void {
  if (
    obj.hasOwnProperty('get') ||
    obj.hasOwnProperty('set') ||
    obj.hasOwnProperty('pure') ||
    obj.hasOwnProperty('environment')
  ) {
    throw Error(
      'slimconfig config can\'t have keys "get", "set", "pure", or "environment"'
    );
  }
}
