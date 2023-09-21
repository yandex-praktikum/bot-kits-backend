import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AccountService } from './accounts.service';
import { Account } from './schema/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiBody({ type: CreateAccountDto })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [Account],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiOperation({
    summary: 'Получить все аккаунты',
  })
  @Get()
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @ApiOkResponse({
    description: 'Аккаунт успешно обновлен',
    type: Account,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiUnprocessableEntityResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiParam({
    name: 'id',
    description: 'Индификатор аккаунта',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные аккаунта по id',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }
}
