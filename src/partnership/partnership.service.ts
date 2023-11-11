import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';

import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schema/profile.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PartnershipService {
  constructor(private profileServices: ProfilesService) {}

  async getPartnerRef(id: string, session?: ClientSession) {
    try {
      const ref = uuidv4().slice(0, 7);
      const profile = await this.profileServices.findPartnerRef(ref);
      if (!profile) {
        await this.profileServices.update(id, { partner_ref: ref }, session);
        return ref; // Возвращаем ref, если профиль обновлен
      } else {
        // Если профиль с таким partner_ref уже существует, повторить попытку
        return this.getPartnerRef(id);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateVisited(ref: string): Promise<Profile> {
    const profile = await this.profileServices.findPartnerRef(ref);

    if (!profile) {
      return;
    }

    profile.visited_ref += 1;

    return await this.profileServices.update(profile._id, {
      visited_ref: profile.visited_ref,
    });
  }

  async updateRegistration(ref?: string): Promise<Profile> {
    if (!ref) {
      return;
    }

    const profile = await this.profileServices.findPartnerRef(ref);
    if (!profile) {
      return;
    }

    profile.registration_ref += 1;

    return await this.profileServices.update(profile._id, {
      registration_ref: profile.registration_ref,
    });
  }
}
