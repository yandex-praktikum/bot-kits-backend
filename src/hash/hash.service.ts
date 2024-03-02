import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  //-- Генерация хэша для пароля --//
  async getHash(password: string): Promise<string> {
    //-- Генерация "соли" для усиления безопасности хэша --//
    const salt = await bcrypt.genSalt();
    //-- Возвращение хэша пароля с использованием сгенерированной "соли" --//
    return await bcrypt.hash(password, salt);
  }

  //-- Проверка соответствия пароля его хэшу --//
  async isPasswordCorrect(password: string, hash: string): Promise<boolean> {
    //-- Сравнение введенного пароля с хэшем, сохраненным в базе данных --//
    return await bcrypt.compare(password, hash);
  }
}
