import { Types } from 'mongoose';

export interface IWithdrawalRequest {
  requestDate: Date;
  paymentDate: Date;
  status: 'Paid' | 'Processing';
  amount: number;
}

interface IVisitedRef {
  timestamp: Date;
}

interface IRegistrationRef {
  profileId: Types.ObjectId | any;
  timestamp: Date;
  paymentAmount: number;
  payments: {
    paymentDate: Date;
    amount: number;
  }[];
}

interface IMonthlyStat {
  month: string;
  visits: number;
  registrations: number;
  paymentsCount: number;
  paymentsAmount: number;
  commissionAmount: number;
  availableForWithdrawal: number;
}

export interface IPartnership {
  profile: Types.ObjectId | any;
  partner_ref: string;
  visited_ref: IVisitedRef[];
  registration_ref: IRegistrationRef[];
  monthlyStats: IMonthlyStat[];
  withdrawalRequests: IWithdrawalRequest[];
}
