import { Controller, Get, Body, UseGuards, Req, Post, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Subscription } from './schema/subscription.schema';

@ApiTags('userSubscriptions')
//@UseGuards(JwtGuard)
@Controller('userSubscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // @Get()
  // all() {
  //   return this.subscriptionsService.findAll();
  // }

  @ApiOperation({
    summary: 'Данные страницы "Подписка и платежи"',
  })
  @ApiOkResponse({
    description: 'Данные подписок и платежей успешно получены',
    schema: {
      type: 'object',
      properties: {
      },
    },
  })
  @Get(':id')
  subscriptionAndPayments(@Param('id') id: string, @Req() req) {
    //const user = req.user;
    return this.subscriptionsService.subscriptionAndPayments(id);//user);
  }

  @ApiOperation({
    summary: 'Активировать подписку',
  })
  @ApiOkResponse({
    description: 'Подписка активирована',
    type: Subscription,
  })
  @Post("activate")
  activateSubscription(@Req() req, @Body() body: { userId: 'string'}) {
    //const user = req.user;
    return this.subscriptionsService.activateSubscription(body.userId);
  }

  @ApiOperation({
    summary: 'Оформить подписку',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cardMask: { type: 'string' }
      },
    },
  })
  @ApiOkResponse({
    description: 'Подписка оформлена',
    type: Subscription,
  })
  @Post('newSubscription/:id')
  createSubscription(@Req() req, @Body() body: { userId: 'string', cardMask: 'string' }, @Param('id') id: string) {
    //const user = req.user;
    return this.subscriptionsService.create({tariffId: id, cardMask: body.cardMask, debitDate: new Date()}, body.userId);
  }
}
