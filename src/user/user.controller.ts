import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
//@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  // constructor(
  // ) { }

  @ApiOperation({
    summary: 'Сброс пароля',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
    },
  })
  @Patch()
  changePassword(
    //@AuthUser() user,
    @Body() body: { email: string },
  ) {
    //return ;
  }

  @ApiOperation({
    summary: 'Платежи и подписки',
  })
  @Get('/payments')
  myPayments() {
    //@AuthUser() user
    //return ;
  }

  @ApiOperation({
    summary: 'Настройки аккаунта',
  })
  @Get('')
  mySettings() {
    //@AuthUser() user
    //return ;
  }
}
