import { Controller, Get, Query, Res } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { Response } from 'express';

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
}
