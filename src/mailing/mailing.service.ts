import { Injectable } from '@nestjs/common';
import { Mailing } from './schema/mailing.schema';
import { MailingRepository } from './mailing.repository';
import { CreateMailingDTO } from './dto/create-mailing.dto';
import { UpdateMailingDTO } from './dto/update-mailing.dto';

@Injectable()
export class MailingService {
  constructor(private readonly dbQuery: MailingRepository) {}

  async findAll(): Promise<Mailing[]> {
    return await this.dbQuery.findAll();
  }

  async findById(id: string): Promise<Mailing> {
    return await this.dbQuery.findById(id);
  }

  async create(
    userId: string,
    createMailingDTO: CreateMailingDTO,
  ): Promise<Mailing> {
    return await this.dbQuery.create(userId, createMailingDTO);
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
