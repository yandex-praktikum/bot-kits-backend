import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';
import { AuthDto } from '../dto/auth.dto';
import { CombinedDto } from '../dto/combined.dto';
import { ConfigService } from '@nestjs/config';
//auth-dto.pipe.ts
@Injectable()
export class AuthDtoPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: CombinedDto, metadata: ArgumentMetadata): AuthDto {
    const enrichedProfile = {
      phone: value.phone,
      username: value.username,
      balance: 0,
      avatar: this.configService.get('PROFILE_AVATAR'),
      accounts: [],
    };

    const enrichedAccount = {
      type: TypeAccount.LOCAL,
      role: Role.ADMIN,
      credentials: {
        email: value.email.toLowerCase(),
        password: value.password,
        accessToken: '',
        refreshToken: '',
      },
      profile: '',
    };

    return {
      profileData: enrichedProfile,
      accountData: enrichedAccount,
    };
  }
}
