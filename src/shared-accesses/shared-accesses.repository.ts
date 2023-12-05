import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import {
  SharedAccess,
  SharedAccessDocument,
} from './schema/sharedAccess.schema';
import { CreateSharedAccessDto } from './dto/create-shared-access.dto';
import { UpdateSharedAccessDto } from './dto/update-shared-access.dto';

export abstract class RepositoryPort {
  abstract create(data: CreateSharedAccessDto): Promise<SharedAccess>;
  abstract findAll(): Promise<SharedAccess[]>;
  abstract updateByEmail(data: UpdateSharedAccessDto): Promise<SharedAccess>;
}

@Injectable()
export class SharedAceessesRepository extends RepositoryPort {
  constructor(
    @InjectModel(SharedAccess.name)
    private sharedAccessModel: Model<SharedAccessDocument>,
  ) {
    super();
  }

  async create(
    createSharedAccessDto: CreateSharedAccessDto,
    session?: ClientSession,
  ): Promise<SharedAccess> {
    const newSharedAccess = new this.sharedAccessModel(createSharedAccessDto);
    if (session) {
      return newSharedAccess.save({ session });
    }
    return newSharedAccess.save();
  }

  async findAll(): Promise<SharedAccess[]> {
    return this.sharedAccessModel.find();
  }

  async updateByEmail(updateSharedAccessDto: UpdateSharedAccessDto) {
    return await this.sharedAccessModel.findOneAndUpdate(
      {
        email: updateSharedAccessDto.email,
        username: updateSharedAccessDto.username,
      },
      { permissions: updateSharedAccessDto.permissions },
      { new: true },
    );
  }
}
