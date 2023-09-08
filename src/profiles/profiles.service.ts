import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profile: Model<Profile>,
    private readonly hashServise: HashService,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const hashedPassword = await this.hashServise.getHash(
      createProfileDto.password,
    );
    try {
      const profile = await this.profile.create({
        ...createProfileDto,
        password: hashedPassword,
      });
      return await profile.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
    }
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profile.findById({ id }).exec();
    return profile;
  }

  async findByProfilename(name: string): Promise<Profile | null> {
    const profile = await this.profile.findOne({ username: name });
    if (profile) {
      return profile;
    } else {
      return null;
    }
  }

  async saveRefreshToken(profileId: number, refreshToken: string) {
    const profile = await this.profile.findById(profileId);
    if (profile) {
      profile.refreshToken = refreshToken;
      await profile.save();
    } else {
      throw new UnauthorizedException('Невалидный refreshToken');
    }
  }

  async findAndDeleteRefreshToken(refreshToken: string) {
    const profile = await this.profile.findOne({ refreshToken });
    if (profile) {
      profile.refreshToken = undefined;
      await profile.save();
      return profile;
    } else {
      return null;
    }
  }
}
