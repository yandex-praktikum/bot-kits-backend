import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Account, AccountDocument } from './schema/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    return await new this.accountModel(createAccountDto).save();
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().populate('profile').exec();
  }

  async findOne(id: string): Promise<Account> {
    return await this.accountModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    await this.accountModel.findByIdAndUpdate(id, updateAccountDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Account> {
    return await this.accountModel.findByIdAndDelete(id).exec();
  }
}
