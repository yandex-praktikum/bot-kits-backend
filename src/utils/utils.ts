import * as bcrypt from 'bcrypt';

export async function getHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

export async function createPaymentData(
  date,
  amount,
  successful,
  operation,
  note,
  profileId,
) {
  return {
    date: date,
    amount: amount,
    successful: successful,
    operation: operation,
    note: note,
    profile: profileId,
  };
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

  return resultDate.toISOString().split('T')[0];
}
