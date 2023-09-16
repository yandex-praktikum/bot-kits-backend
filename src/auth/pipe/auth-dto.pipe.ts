import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthDtoPipe implements PipeTransform {
  transform(value: AuthDto, metadata: ArgumentMetadata): AuthDto {
    const enrichedProfile = {
      balance: 0,
      avatar: 'https://i.pravatar.cc/300',
      accounts: [],
      ...value.profileData,
    };

    const enrichedAccount = {
      type: TypeAccount.LOCAL,
      role: Role.USER,
      credentials: {
        email: value.accountData.credentials.email,
        password: value.accountData.credentials.password,
        accessToken: '',
        refreshToken: '',
      },
      profile: '',
      ...value.accountData,
    };

    return {
      profileData: enrichedProfile,
      accountData: enrichedAccount,
    };
  }
}
