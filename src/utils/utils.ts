import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import TypeOperation from 'src/payments/types/type-operation';
import { Promocode } from 'src/promocodes/schema/promocode.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';

export async function getHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

type TPaymentData = {
  date: Date;
  amount: number;
  successful: boolean;
  operation: TypeOperation;
  note: string;
  profile: Profile; // Предположим, что у вас есть тип Profile
  tariff?: Tariff; // Тип Tariff, необязательный параметр
  promocode?: Promocode;
};

export async function createPaymentData(
  date: Date,
  amount: number,
  successful: boolean,
  operation: TypeOperation,
  note: string,
  profile: Profile, // Предположим, что у вас есть тип Profile
  tariff?: Tariff | undefined, // Тип Tariff, необязательный параметр
  promocode?: Promocode | undefined, // Тип Promocode, необязательный параметр
): Promise<TPaymentData> {
  // Тип PaymentData для возвращаемого объекта
  const paymentData: TPaymentData = {
    date,
    amount,
    successful,
    operation,
    note,
    profile,
    ...(tariff && { tariff }), // Добавление поля только если оно определено
    ...(promocode && { promocode }), // Добавление поля только если оно определено
  };

  return paymentData;
}

export async function addDuration(currentDate, duration) {
  const durationValue = parseInt(duration, 10); // извлекаем числовое значение
  const durationType = duration.slice(-1); // извлекаем тип длительности (d для дней, м для месяцев)
  // создаем объект даты из текущей даты
  const resultDate = new Date(currentDate);

  if (durationType.toUpperCase() === 'D') {
    // добавляем дни
    resultDate.setDate(resultDate.getDate() + durationValue);
  } else if (durationType.toUpperCase() === 'M') {
    // добавляем месяцы
    resultDate.setMonth(resultDate.getMonth() + durationValue);
  }

  return resultDate.toISOString();
}
