import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashLibService {
  async hash(value: string): Promise<string> {
    try {
      return await argon2.hash(value, { type: argon2.argon2id });
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async isMatch(value: string, hash: string): Promise<boolean> {
    try {
      if (await argon2.verify(hash, value, { type: argon2.argon2id })) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // internal failure
      return false;
    }
  }
}
