import { Injectable } from '@nestjs/common';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schema/profile.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PartnershipService {
  constructor(private profileServices: ProfilesService) {}
  async getPartnerRef(id: string) {
    async function getRef() {
      try {
        const ref = uuidv4().slice(0, 7);
        const profile = await this.profileServices.findByPartnerRef(ref);

        if (!profile) {
          await this.profileServices.update(id, { partner_ref: ref });
        } else {
          // Если профиль с таким partner_ref уже существует, повторить попытку
          return getRef();
        }
      } catch (error) {
        throw error;
      }
    }
    return getRef();
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

  async updateRegistration(ref: string | null): Promise<Profile> {
    if (ref === null) {
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
