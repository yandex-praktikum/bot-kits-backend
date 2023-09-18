import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountService } from 'src/accounts/accounts.service';
import TypeAccount from 'src/accounts/types/type-account';
import { AuthDto } from './dto/auth.dto';
import Role from 'src/accounts/types/role';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private accountService: AccountService,
    private hashService: HashService,
  ) {}

  private async getTokens(profileId): Promise<ITokens> {
    const payload = { sub: profileId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async auth(profile: ProfileDocument): Promise<Profile> {
    const tokens = await this.getTokens(profile._id);
    const authProfile = await this.accountService.saveRefreshToken(
      profile._id,
      tokens,
    );
    const findProfile = await this.profilesService.findById(authProfile._id);
    return findProfile;
  }

  async validatePassword(
    accountEmail: string,
    password: string,
  ): Promise<Profile> {
    const account = await this.accountService.findByEmailAndType(
      accountEmail,
      TypeAccount.LOCAL,
    );
    const isPasswordMatched = await this.hashService.isPasswordCorrect(
      password,
      account.credentials.password,
    );

    if (!account || !isPasswordMatched)
      throw new UnauthorizedException('Неверное имя пользователя или пароль');

    return account.profile;
  }

  async refreshToken(oldRefreshToken: string): Promise<ITokens> {
    //--Проверяем, есть ли oldRefreshToken в базе данных и удаляем его--//
    const account = await this.accountService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!account) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }

    //--Создаем новые accessToken и refreshToken--//
    const tokens = await this.getTokens(account.profile);

    //--Обновляем refreshToken в базе данных--//
    await this.accountService.saveRefreshToken(account.profile._id, tokens);

    return tokens;
  }

  async registration(
    authDto: AuthDto,
    provider: TypeAccount = TypeAccount.LOCAL,
    role: Role = Role.USER,
  ): Promise<Profile> {
    const { profileData, accountData } = authDto;
    const email = accountData.credentials.email;
    accountData.type = provider;
    let profile;

    const existsAccountByTypeAndEmail =
      await this.accountService.findByEmailAndType(email, provider);

    if (existsAccountByTypeAndEmail) {
      throw new ConflictException('Аккаунт уже существует');
    }

    const existsAccount = await this.accountService.findByEmail(email);

    if (!existsAccount) {
      //--Создаем новый профиль--//
      profile = await this.profilesService.create(profileData);
    } else {
      profile = await this.profilesService.findByEmail(email);
    }

    //--Создаем новый аккаунт--//
    const newAccount = await this.accountService.create(
      accountData,
      profile._id,
    );

    const tokens = await this.getTokens(profile._id);

    accountData.credentials.accessToken = tokens.accessToken;
    accountData.credentials.refreshToken = tokens.refreshToken;

    await this.accountService.update(newAccount._id, accountData);

    profile.accounts.push(newAccount);
    await profile.save();

    const returnProfile = await this.profilesService.findById(profile._id);
    returnProfile.accounts.map((account) => {
      delete account.credentials.password;
    });

    return returnProfile;
  }

  async sendPasswordResetEmail(email) {
    const profile = await this.profilesService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Пользователь с указанным Email не найден');
    }
    return {
      message: `Ссылка на сброс пароля отправлена на ваш email: ${email}`,
    };
  }

  async authSocial(dataLogin: AuthDto, typeAccount: TypeAccount) {
    const user = await this.accountService.findByEmailAndType(
      dataLogin.accountData.credentials.email,
      typeAccount,
    );

    if (user) {
      const { refreshToken, accessToken } = await this.getTokens(
        user.profile._id,
      );

      return await this.accountService.update(user._id, {
        credentials: {
          email: user.credentials.email,
          refreshToken,
          accessToken,
        },
      });
    }

    return await this.registration(dataLogin, typeAccount);
  }
}
