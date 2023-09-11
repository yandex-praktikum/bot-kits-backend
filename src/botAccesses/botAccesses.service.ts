import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotAccess } from './shema/botAccesses.shema';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import Permission from './types/types';


@Injectable()
export class BotAccessesService {
  constructor(
    @InjectModel(BotAccess.name) private access: Model<BotAccess>,
    private readonly profileService: ProfilesService,
  ) {}

  async create(userId, createBotAccessDto: CreateBotAccessDto): Promise<BotAccess> {
    try {
      const botAccess = await this.access.create({...createBotAccessDto, userId});
      return botAccess.save()

    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Данный доступ уже предоставлен',
        );
      }
    }
  }

  async findOne(id): Promise<BotAccess> {
    const access = await this.access.findById(id).exec();

    if (!access) {
      throw new NotFoundException(
          'Данного доступа нет',
      );
    }

    return access;
  }

  async delete(superAdminId: string, botAccessId: string): Promise<BotAccess> {
    const botAccess = await this.findOne(botAccessId)
    const superAdmin = await this.isSuperAdmin(superAdminId, botAccess.botId)

    if (!superAdmin) {
      throw new ForbiddenException(
          'Недостаточно прав редактировать удалять к боту',
      );
    }

    return await botAccess.deleteOne();
  }

  async findOneByUserAndBotIds(userId, botId): Promise<BotAccess> {
    const access = await this.access.findOne({
      userId,
      botId,
    }).exec();

    if (!access) {
      throw new ConflictException(
          'Данного доступа нет',
      );
    }

    return access;
  }

  async findAll(): Promise<BotAccess[]> {
    return await this.access.find().exec()
  }

  async getPermission(userId, botId): Promise<Permission> {
    const botAccess = await this.findOneByUserAndBotIds(userId, botId)
    return botAccess.permission
  }

  async isSuperAdmin(userId, botId): Promise<boolean> {
    const permission = await this.getPermission(userId, botId)
    return permission === Permission.SUPER_ADMIN
  }

  async updateAccess(superAdminId, botAccessId, updateBotAccessDto: UpdateBotAccessDto): Promise<BotAccess> {
    const botAccess = await this.findOne(botAccessId)
    const superAdmin = await this.isSuperAdmin(superAdminId, botAccess.botId)

    if (!superAdmin) {
      throw new ForbiddenException(
          'Недостаточно прав редактировать доступ к боту',
      );
    }
    return botAccess.updateOne(updateBotAccessDto)
  }

  async shareAccess(superAdminId, botId, shareBotAccessDto: ShareBotAccessDto): Promise<BotAccess> {
    const superAdmin = await this.isSuperAdmin(superAdminId, botId);

    if (!superAdmin) {
      throw new ForbiddenException(
          'Недостаточно прав предоставлять доступ к боту',
      );
    }

    // предполагалась проверка по email
    // const user = this.profileService.findOneByEmail(shareBotAccessDto.email)
    // пока просто захардкоженный user
    const user = {id: 'idid'}

    if (!user) {
      throw new NotFoundException('Можно предоставить доступ только зарегистрированному пользователю')
    }

    return await this.create(user.id, { botId, permission: shareBotAccessDto.permission })
  }

}
