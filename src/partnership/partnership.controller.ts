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

  //-- Метод контроллера для редиректа пользователя на страницу регистрации --//
  @Get()
  redirectToPage(@Res() res: Response, @Query('ref') ref: string) {
    if (ref) {
      //-- Если в запросе есть реферальный код (ref), обновляем счетчик переходов по этой ссылке --//
      this.partnershipService.updateVisited(ref);
      //-- Перенаправляем пользователя на страницу регистрации с реферальным кодом в параметрах --//
      return res.redirect(301, '/signup?ref=' + ref);
    } else {
      //-- Если реферальный код отсутствует, просто перенаправляем на страницу регистрации --//
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
