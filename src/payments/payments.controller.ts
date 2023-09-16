import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Payment } from './schema/payment.schema';
//import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post()
  // create(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
  //   const profile = req.user;
  //   return this.paymentsService.create({ ...createPaymentDto, profile});
  // }

  @ApiOperation({
    summary: 'История платежей',
  })
  @ApiOkResponse({
    description: 'История платежей успешно получена',
    type: [Payment],
  })
  @Get()
  userPayments(@Req() req) {
    const user = req.user;
    return this.paymentsService.findUsersAll(user);
  }
}
