import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Mailing } from './schema/mailing.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailingRepository {
  constructor(@InjectModel(Mailing.name) private mailing: Model<Mailing>) {}
}
