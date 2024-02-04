import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlacklistTokens,
  BlacklistTokensDocument,
} from './schema/blacklistTokens.schema';
import { decode } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { Profile, ProfileDocument } from '../profiles/schema/profile.schema';

@Injectable()
export class BlacklistTokensRepository {
  constructor(
    @InjectModel(BlacklistTokens.name)
    private readonly blacklistTokensModel: Model<BlacklistTokensDocument>,
    private readonly jwtService: JwtService,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  //--Удаляем истекшие токены из БД--//
  private async cleanupTokens(): Promise<void> {
    const now = new Date();
    await this.blacklistTokensModel.deleteMany({
      expirationDate: { $lt: now },
    });
  }

  async addToken(token: string): Promise<void> {
    //--Декодируем токен без проверки подлинности--//
    const decodedToken: any = decode(token);

    //--Проверяем, существует ли поле exp в декодированном токене--//
    if (!decodedToken?.exp) {
      throw new BadRequestException('Невалидный токен');
    }

    //--Преобразуем временную метку UNIX в объект Date--//
    const expirationDate = new Date(decodedToken.exp * 1000);

    const blacklistedToken = new this.blacklistTokensModel({
      token,
      expirationDate,
    });
    await blacklistedToken.save();
    await this.cleanupTokens();
  }

  //--Проверяем есть находитсся ли токен в черном списке--//
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const count = await this.blacklistTokensModel.countDocuments({ token });
    return count > 0;
  }

  async updateLastActivity(token: string) {
    const decoded = this.jwtService.decode(token);

    if (decoded && decoded.sub) {
      await this.profileModel.updateOne(
        { _id: decoded.sub },
        { $set: { lastAccountActivity: new Date() } },
      );
    }
  }
}
