import { CreatePromocodeDto } from '../create-promocode.dto';

export const promocodesTemplates: CreatePromocodeDto[] = [
  {
    code: 'Motherlode',
    actionPeriod: new Date('2025-01-17T00:00:00.000+00:00'),
    activationCount: 0,
    maxActivationCount: 5,
    amount: 2000,
  },
];
