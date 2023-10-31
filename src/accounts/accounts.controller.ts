import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AccountsService } from './accounts.service';
import { Account } from './schema/account.schema';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { SingleAccountResponseBodyOK } from './sdo/response-body.sdo';
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
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Аккаунт успешно обновлен',
    type: SingleAccountResponseBodyOK,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
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
