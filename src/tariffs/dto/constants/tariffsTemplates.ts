import { CreateTariffDto } from '../create-tariff.dto';

export const tariffsTemplates: CreateTariffDto[] = [
  {
    name: 'Старт',
    price: 390,
    botsCount: 100,
    subscribersCount: 1000,
    duration: '1M',
    status: true,
  },
  {
    name: 'Стандарт',
    price: 790,
    botsCount: 200,
    subscribersCount: 5000,
    duration: '1M',
    status: true,
  },
  {
    name: 'Бизнес',
    price: 1490,
    botsCount: 500,
    subscribersCount: 10000,
    duration: '1M',
    status: true,
  },
];
