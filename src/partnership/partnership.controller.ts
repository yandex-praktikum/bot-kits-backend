import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { TJwtRequest } from 'src/types/jwtRequest';

@ApiTags('partnership')
@Controller('partnership')
export class PartnershipController {
  constructor(private readonly partnershipService: PartnershipService) {}

  @Get()
  redirectToPage(@Res() res: Response, @Query('ref') ref: string) {
    if (ref) {
      // добавление счетчика перехода по ссылке
      this.partnershipService.updateVisited(ref);
      //редирект на регистрацию с пробрасыванием рефа
      return res.redirect(301, '/signup?ref=' + ref);
    } else {
      return res.redirect(301, '/signup');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('statistic')
  getStatistic(@Req() req: TJwtRequest) {
    return this.partnershipService.getStatistic(req.user.id);
  }
}
