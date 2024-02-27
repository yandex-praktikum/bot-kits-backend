import { Injectable } from '@nestjs/common';
import { Mailing } from './schema/mailing.schema';
import { MailingRepository } from './mailing.repository';
import { CreateMailingDTO } from './dto/create-mailing.dto';
import { UpdateMailingDTO } from './dto/update-mailing.dto';
import { Profile } from 'src/profiles/schema/profile.schema';

@Injectable()
export class MailingService {
  constructor(private readonly dbQuery: MailingRepository) {}

  async findAll(): Promise<Mailing[]> {
    return await this.dbQuery.findAll();
  }

  async findAllActive(): Promise<Mailing[]> {
    return await this.dbQuery.findAllActive();
  }

  async findAllByBotId(botId: string): Promise<Mailing[]> {
    return await this.dbQuery.findAllByBotId(botId);
  }

  async findById(id: string): Promise<Mailing> {
    return await this.dbQuery.findById(id);
  }

  async create(
    user: Profile,
    createMailingDTO: CreateMailingDTO,
  ): Promise<Mailing> {
    return await this.dbQuery.create(user, createMailingDTO);
  }

  async remove(id: string | number): Promise<Mailing> {
    return await this.dbQuery.remove(id);
  }

  async update(
    updateMailingDTO: UpdateMailingDTO,
    id: string | number,
    userId: string,
  ) {
    return await this.dbQuery.update(updateMailingDTO, id, userId);
  }
}
