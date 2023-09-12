import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import TypeAccount from '../../account/types/type-account';
import Role from '../../account/types/role';
import { AuthDto } from '../dto/auth.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthDtoPipe implements PipeTransform {
  transform(value: AuthDto, metadata: ArgumentMetadata): AuthDto {
    const enrichedProfile = {
      balance: 0,
      avatar: 'https://i.pravatar.cc/300',
      accounts: [],
      ...value.profileDto,
    };

    const enrichedAccount = {
      type: TypeAccount.LOCAL,
      role: Role.USER,
      credentials: {
        email: value.accountDto.credentials.email,
        password: value.accountDto.credentials.password,
        accessToken: '',
        refreshToken: '',
      },
      profile: '',
      ...value.accountDto,
    };

    return {
      profileDto: enrichedProfile,
      accountDto: enrichedAccount,
    };
  }
}
