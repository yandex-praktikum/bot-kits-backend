import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Subscription } from './schema/subscription.schema';
import { Payment } from 'src/payments/schema/payment.schema';
import { TJwtRequest } from '../types/jwtRequest';
import { CreateSubscriptionDto } from '../subscriptions/dto/create-subscription.dto';
import { ActivateSubscriptionDTO } from './dto/activate-subscription.dto';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
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
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  subscriptionAndPayments(@Req() req: TJwtRequest): Promise<object> {
    return this.subscriptionsService.subscriptionAndPayments(req.user);
  }

  @Post('activate')
  @ApiOperation({
    summary: 'Активировать(отменить) подписку',
  })
  @ApiBody({
    type: ActivateSubscriptionDTO,
  })
  @ApiCreatedResponse({
    description: 'Подписка активирована',
    type: Subscription,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  activateSubscription(
    @Req() req: TJwtRequest,
    @Body() activateSubscription: ActivateSubscriptionDTO,
  ): Promise<Subscription> {
    return this.subscriptionsService.activateSubscription(
      req.user._id,
      activateSubscription.status,
    );
  }

  @Post(':tariffId')
  @ApiOperation({
    summary: 'Оформить подписку',
  })
  @ApiParam({
    name: 'tariffId',
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
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  async createSubscription(
    @Req() { user }: TJwtRequest,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Param('tariffId') tariffId: string,
  ): Promise<Subscription> {
    console.log(createSubscriptionDto.debitDate);
    return this.subscriptionsService.create(
      tariffId,
      user,
      createSubscriptionDto,
    );
  }
}
