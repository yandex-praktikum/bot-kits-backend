import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('botTemplates')
//@UseGuards(JwtAuthGuard)
@Controller('botTemplates')
export class botTemplatesController {
  // constructor(
  // ) { }

  @ApiOperation({
    summary: 'Список шаблонов ботов',
  })
  @Get()
  findAll() {
    //return ;
  }

  @ApiOperation({
    summary: 'Данные шаблона бота',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    //return ;
  }
}
