import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Subscription } from './schema/subscription.schema';
import { Payment } from 'src/payments/schema/payment.schema';

@ApiTags('userSubscriptions')
@UseGuards(JwtGuard)
@Controller('userSubscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({
    summary: 'Данные страницы "Подписка и платежи"',
  })
  @ApiOkResponse({
    description: 'Данные подписок и платежей успешно получены',
    schema: {
      type: 'object',
      properties: {
        tariff: { type: 'string', example: 'Бизнес' },
        status: { type: 'boolean', example: true },
        cardMask: { type: 'string', example: '4500 *** 1119' },
        debitDate: { type: 'date', example: '2023-09-12' },
        balance: { type: 'number', example: 1234 },
        payments: { type: 'array', items: { $ref: getSchemaPath(Payment) } },
      },
    },
  })
  @Get()
  subscriptionAndPayments(@Req() req) {
    const user = req.user;
    return this.subscriptionsService.subscriptionAndPayments(user);
  }

  @ApiOperation({
    summary: 'Активировать подписку',
  })
  @ApiCreatedResponse({
    description: 'Подписка активирована',
    type: Subscription,
  })
  @Post('activate')
  activateSubscription(@Req() req) {
    const user = req.user;
    return this.subscriptionsService.activateSubscription(user);
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
        cardMask: { type: 'string', example: '4500 *** 1119' },
        debitDate: { type: 'date', example: '2023-09-12' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Подписка оформлена',
    type: Subscription,
  })
  @Post('newSubscription/:id')
  createSubscription(
    @Req() req,
    @Body() body: { cardMask: 'string'; debitDate: 'string' },
    @Param('id') id: string,
  ) {
    const profile = req.user;
    return this.subscriptionsService.create({
      tariffId: id,
      cardMask: body.cardMask,
      debitDate: new Date(body.debitDate),
      profile,
    });
  }
}
