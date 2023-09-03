import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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
  async signup(@Body() createUserDto: CreateUserDto) {
    //return ;
  }
}
