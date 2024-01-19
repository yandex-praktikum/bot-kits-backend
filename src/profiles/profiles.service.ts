import { Injectable } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Access, Profile } from './schema/profile.schema';
import { Account } from 'src/accounts/schema/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesRepository } from './profiles.repository';
import { CreateSharedAccessDto } from './dto/create-access.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async create(
    createProfileDto: CreateProfileDto,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    return await this.profilesRepository.create(createProfileDto, session);
  }

  async findOne(id: string | number): Promise<Profile> {
    return await this.profilesRepository.findOne(id);
  }

  async findById(id: string): Promise<Profile> {
    return await this.profilesRepository.findById(id);
  }

  async findAccountsByProfileId(id: string): Promise<Account[]> {
    return await this.profilesRepository.findAccountsByProfileId(id);
  }

  async findByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const account = await this.profilesRepository.findAccountByEmail(
      email,
      session,
    );
    if (account) {
      return account.profile;
    }
    return null;
  }

  async findByToken(token: string): Promise<Profile | null> {
    const account = await this.profilesRepository.findAccountByToken(token);
    if (account) {
      return account.profile;
    }
    return null;
  }

  async findAll(): Promise<Profile[]> {
    return await this.profilesRepository.findAll();
  }

  async findPartnerRef(ref: string): Promise<Profile | null> {
    return await this.profilesRepository.findByPartnerRef(ref);
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    session?: ClientSession,
  ): Promise<Profile> {
    return await this.profilesRepository.update(id, updateProfileDto, session);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profilesRepository.remove(id);
  }

  async sharedAccess(
    createSharedAccessDto: CreateSharedAccessDto,
    userId: string,
  ) {
    try {
      return await this.profilesRepository.sharedAccess(
        createSharedAccessDto,
        userId,
      );
    } catch (e) {
      return e;
    }
  }

  async findAllGrantedAccesses(userId: string): Promise<Access[]> {
    return await this.profilesRepository.findAllGrantedAccesses(userId);
  }

  async updateAccesses(userId: string, access: Access) {
    try {
      return await this.profilesRepository.updateAccesses(userId, access);
    } catch (e) {
      return e;
    }
  }
}
