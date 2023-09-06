import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  // constructor(
  // ) { }

  @ApiOperation({
    summary: 'Авторизация',
  })
  @Post('login')
  login(@Body() authUserDto: AuthUserDto) {
    //return ;
  }

  @ApiOperation({
    summary: 'Выход из профиля',
  })
  @Post('logout')
  logout() {
    //return ;
  }

  @ApiOperation({
    summary: 'Регистрация',
  })
  @Post('signup')
  async signup(@Body() createUserDto: any) {
    //return ;
  }
}
