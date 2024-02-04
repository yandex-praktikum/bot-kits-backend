import { CreateTariffDto } from '../create-tariff.dto';

export const tariffsTemplates: CreateTariffDto[] = [
  {
    name: 'Демо',
    price: 0,
    botsCount: 10,
    subscribersCount: 120,
    duration: '0D',
    status: true,
    isStarted: true,
    isDemo: true,
  },
  {
    name: 'Старт',
    price: 390,
    botsCount: 100,
    subscribersCount: 1000,
    duration: '0d',
    status: true,
    isStarted: false,
  },
  {
    name: 'Стандарт',
    price: 790,
    botsCount: 200,
    subscribersCount: 5000,
    duration: '0d',
    status: true,
    isStarted: false,
  },
  {
    name: 'Бизнес',
    price: 1490,
    botsCount: 500,
    subscribersCount: 10000,
    duration: '0d',
    status: true,
    isStarted: false,
  },
];
