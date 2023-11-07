import { Injectable } from '@nestjs/common';
import { CreateSharedAccessDto } from './dto/create-shared-access.dto';
import { UpdateSharedAccessDto } from './dto/update-shared-access.dto';
import { SharedAceessesRepository } from './shared-accesses.repository';
import { ClientSession } from 'mongoose';

@Injectable()
export class SharedAccessesService {
  constructor(private dbQuery: SharedAceessesRepository) {}
  create(
    createSharedAccessDto: CreateSharedAccessDto,
    session?: ClientSession,
  ) {
    return this.dbQuery.create(createSharedAccessDto, session);
  }

  async findAll() {
    return await this.dbQuery.findAll();
  }

  async updateByEmail(updateSharedAccessDto: UpdateSharedAccessDto) {
    return await this.dbQuery.updateByEmail(updateSharedAccessDto);
  }
}
