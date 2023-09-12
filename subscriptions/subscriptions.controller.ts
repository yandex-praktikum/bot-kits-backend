import { Controller, Get, Body, UseGuards, Req, Post, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from '../src/auth/guards/jwtAuth.guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('userSubscriptions')
//@UseGuards(JwtGuard)
@Controller('userSubscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  all() {
    return this.subscriptionsService.findAll();
  }

  @ApiOperation({
    summary: 'Данные страницы "Подписка и платежи"',
  })
  @Get(':id')
  subscriptionAndPayments(@Param('id') id: string, @Req() req) {
    //const user = req.user;
    return this.subscriptionsService.subscriptionAndPayments(id);//user);
  }

  @ApiOperation({
    summary: 'Активировать подписку',
  })
  @Post("activate")
  activateSubscription(@Req() req, @Body() body: { userId: 'string'}) {
    //const user = req.user;
    return this.subscriptionsService.activateSubscription(body.userId);
  }

  @ApiOperation({
    summary: 'Оформить подписку',
  })
  @Post('newSubscription/:id')
  createSubscription(@Req() req, @Body() body: { userId: 'string', cardMask: 'string' }, @Param('id') id: string) {
    //const user = req.user;
    return this.subscriptionsService.create({tariffId: id, cardMask: body.cardMask, debitDate: new Date()}, body.userId);
  }
}
