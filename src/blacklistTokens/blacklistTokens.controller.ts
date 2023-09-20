import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { BlacklistTokensService } from './blacklistTokens.service';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@Controller()
export class BlacklistTokensController {
  constructor(
    private readonly blacklistTokensService: BlacklistTokensService,
  ) {}

  @Get('logout')
  async addToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    await this.blacklistTokensService.addToken(token);
    return { message: 'Token added to blacklist.' };
  }
}
