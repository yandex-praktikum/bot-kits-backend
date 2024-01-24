import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Payment } from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Profile } from 'src/profiles/schema/profile.schema';
import { TJwtRequest } from 'src/types/jwtRequest';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Get()
  @ApiOperation({
    summary: 'История платежей',
  })
  @ApiOkResponse({
    description: 'История платежей успешно получена',
    type: [Payment],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  userPayments(@Req() req: TJwtRequest): Promise<Payment[]> {
    return this.paymentsService.findUsersAll(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Добавить данные финансовой операции',
  })
  @ApiCreatedResponse({
    description: 'Операция успешно добавлена',
    type: Payment,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req,
  ): Promise<Payment> {
    try {
      const data = this.paymentsService.create(req.user.id, {
        ...createPaymentDto,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить финансовую операцию',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор фин.операции',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Операция успешно удалена',
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить данные финансовой операции',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор фин.операции',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Операция успешно обновлена',
    type: Payment,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @AuthUser() profile: Profile,
    @Param('id') id: string,
    @Body() updatePaymentDto: Omit<CreatePaymentDto, 'profie'>,
  ): Promise<Payment> {
    return this.paymentsService.update(id, { ...updatePaymentDto });
  }
}
