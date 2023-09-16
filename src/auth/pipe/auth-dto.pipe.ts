import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';
import { AuthDto } from '../dto/auth.dto';
import { CombinedDto } from '../dto/combined.dto';

@Injectable()
export class AuthDtoPipe implements PipeTransform {
  transform(value: CombinedDto, metadata: ArgumentMetadata): AuthDto {
    const enrichedProfile = {
      phone: value.phone,
      username: value.username,
      balance: 0,
      avatar: 'https://i.pravatar.cc/300',
      accounts: [],
    };

    const enrichedAccount = {
      type: TypeAccount.LOCAL,
      role: Role.USER,
      credentials: {
        email: value.email,
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
