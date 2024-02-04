import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { BlacklistTokensService } from './blacklistTokens.service';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../profiles/schema/profile.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@ApiTags('logout')
@Controller('logout')
export class BlacklistTokensController {
  constructor(
    private readonly blacklistTokensService: BlacklistTokensService,
    private readonly jwtService: JwtService,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Разлогинить пользователя',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiOkResponse({
    description: 'Пользователь успешно разлогинен',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Сообщение об успешном разлогине',
        },
      },
    },
  })
  async addToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    // console.log(token)
    await this.blacklistTokensService.addToken(token);
    const decoded = this.jwtService.decode(token);

    if (decoded && decoded.sub) {
      await this.profileModel.updateOne(
        { _id: decoded.sub },
        { $set: { lastAccountActivity: new Date() } },
      );
    }

    return { message: 'User logged out' };
  }
}
