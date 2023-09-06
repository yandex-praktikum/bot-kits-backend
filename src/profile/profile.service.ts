import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schema/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return await new this.profileModel(createProfileDto).save();
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    return await this.profileModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.profileModel.findByIdAndUpdate(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profileModel.findByIdAndDelete(id).exec();
  }
}
