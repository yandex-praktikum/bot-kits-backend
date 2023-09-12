import { Injectable } from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';

@Injectable()
export class PromocodeService {
  create(createPromocodeDto: CreatePromocodeDto) {
    return 'This action adds a new promocode';
  }

  findAll() {
    return `This action returns all promocode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promocode`;
  }

  update(id: number, updatePromocodeDto: UpdatePromocodeDto) {
    return `This action updates a #${id} promocode`;
  }

  remove(id: number) {
    return `This action removes a #${id} promocode`;
  }
}
