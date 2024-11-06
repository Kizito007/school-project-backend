import { customAlphabet } from 'nanoid';
import { KeyType } from '../enums';

export class KeyGen {
  /* istanbul ignore next */
  static gen(length: number, type?: KeyType): string {
    let dict: string;
    switch (type) {
      case KeyType.NUMERIC:
        dict = '0123456789';
        break;

      case KeyType.ALPHANUMERIC:
        dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopuvwxyz';
        break;

      default:
        dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
    }
    const nanoid = customAlphabet(dict, length);
    return nanoid();
  }
}
