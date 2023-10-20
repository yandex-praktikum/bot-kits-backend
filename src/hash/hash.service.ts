import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async getHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async isPasswordCorrect(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
