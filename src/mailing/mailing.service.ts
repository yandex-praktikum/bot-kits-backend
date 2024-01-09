import { Injectable } from '@nestjs/common';
import { Mailing } from './schema/mailing.schema';
import { MailingRepository } from './mailing.repository';

@Injectable()
export class MailingService {
  constructor(private readonly dbQuery: MailingRepository) {}
}
