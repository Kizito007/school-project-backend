import * as bcrypt from 'bcrypt';

export class TokenHandler {
  static async hashKey(key: string): Promise<string> {
    try {
      const saltRounds = 10; // Adjust salt rounds as needed
      return await bcrypt.hash(key, saltRounds);
    } catch (error) {
      /* istanbul ignore next */
      console.error(error);
    }
  }

  static async verifyKey(hash: string, plain: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plain, hash);
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  }
}
