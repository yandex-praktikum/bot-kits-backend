import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AccountService } from './accounts.service';
import { Account } from './schema/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiBody({ type: CreateAccountDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Account,
  })
  @ApiOkResponse({
    description: 'The resources were returned successfully',
    type: [Account],
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get()
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @ApiOkResponse({
    description: 'The resource was updated successfully',
    type: Account,
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiParam({
    name: 'id',
    description: 'Индификатор аккаунта',
    example: '64f81ba37571bfaac18a857f',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }
}
