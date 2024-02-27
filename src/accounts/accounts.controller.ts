import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AccountsService } from './accounts.service';
import { Account } from './schema/account.schema';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import {
  BadRequestResponse,
  InvalidTokenResponse,
  SingleAccountResponseBodyOK,
} from './sdo/response-body.sdo';
import { AccountUpdateRequestBody } from './sdo/request-body.sdo';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtGuard)
@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Получение всех пользователей',
  })
  @ApiOkResponse({
    description: 'Успешный ответ сервера',
    type: [SingleAccountResponseBodyOK],
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный токен',
    type: InvalidTokenResponse,
  })
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Аккаунт успешно обновлен',
    type: SingleAccountResponseBodyOK,
  })
  @ApiBadRequestResponse({
    description: 'Неверный запрос',
    type: BadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный токен',
    type: InvalidTokenResponse,
  })
  @ApiBody({ type: AccountUpdateRequestBody })
  @ApiParam({
    name: 'id',
    description: 'Индификатор аккаунта',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные аккаунта по id',
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }
}
