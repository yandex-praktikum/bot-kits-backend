import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Account, AccountDocument } from './schema/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { HashService } from 'src/hash/hash.service';
//account.service.ts
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private readonly hashServise: HashService,
  ) {}

  async create(account: CreateAccountDto, profile: Types.ObjectId) {
    const hashedPassword = await this.hashServise.getHash(
      account.credentials.password,
    );
    account.credentials.password = hashedPassword;
    account.profile = profile._id;
    try {
      const accountNew = await this.accountModel.create(account);
      await accountNew.save();
      return accountNew;
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
    }
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
  //account.service.ts
  async findByEmail(email: string): Promise<Account | null> {
    return await this.accountModel
      .findOne({ 'credentials.email': email })
      .populate('profile');
  }

  async findAndDeleteRefreshToken(refreshToken: string) {
    const account = await this.accountModel.findOne({
      'credentials.refreshToken': refreshToken,
    });
    if (account) {
      account.credentials.refreshToken = undefined;
      await account.save();
      return account;
    } else {
      return null;
    }
  }

  async remove(id: string): Promise<Account> {
    return await this.accountModel.findByIdAndDelete(id).exec();
  }

  async saveRefreshToken(profileId: Types.ObjectId, refreshToken: string) {
    const updatedAccount = await this.accountModel
      .findOneAndUpdate(
        { profile: profileId },
        { 'credentials.refreshToken': refreshToken },
        { new: true }, //--Этот параметр возвращает измененный документ.--//
      )
      .populate('profile'); //--Возвращает вместе с документом Profile.--//

    if (updatedAccount) {
      return updatedAccount.profile;
    } else {
      throw new UnauthorizedException('Невалидный refreshToken');
    }
  }
}
