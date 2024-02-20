import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { TJwtRequest } from 'src/types/jwtRequest';
import { PartnershipStatsDto } from './dto/partnership-stats.dto';
import { WithdrawalResponseDto } from './dto/response-commission.dto';
import { CreateWithdrawalRequestDto } from './dto/request-commission.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Profile } from '../profiles/schema/profile.schema';

@ApiTags('partnership')
@Controller('partnership')
export class PartnershipController {
  constructor(private readonly partnershipService: PartnershipService) {}

  redirectToPage(@Res() res: Response, @Query('ref') ref: string) {
    if (ref) {
      // Добавление счетчика перехода по ссылке без ожидания завершения
      this.partnershipService.addVisitedRef(ref).catch((error) => {
        console.error('Error adding visited_ref:', error);
      });

      // Редирект на регистрацию с пробрасыванием рефа
      return res.redirect(301, `/signup?ref=${ref}`);
    } else {
      return res.redirect(301, '/signup');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Получение статистики партнерской программы' })
  @ApiParam({
    name: 'partnerRef',
    required: true,
    description: 'Реферальный код партнера',
    type: String,
  })
  @ApiOkResponse({
    description: 'Статистика партнерской программы успешно получена',
    type: PartnershipStatsDto,
  })
  @ApiNotFoundResponse({ description: 'Партнерская программа не найдена' })
  @ApiForbiddenResponse({ description: 'Доступ запрещен' })
  @Get('stats')
  async getPartnershipStats(
    @Param('partnerRef') partnerRef: string,
  ): Promise<PartnershipStatsDto> {
    return this.partnershipService.getPartnershipStats(partnerRef);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/withdrawal')
  @ApiOperation({ summary: 'Создание запроса на вывод средств' })
  @ApiBody({ type: CreateWithdrawalRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Запрос на вывод средств успешно создан',
    type: WithdrawalResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса' })
  @UseGuards(JwtGuard)
  async createWithdrawalRequest(
    @AuthUser() user: Profile,
    @Body() createDto: CreateWithdrawalRequestDto,
  ): Promise<WithdrawalResponseDto> {
    return this.partnershipService.createWithdrawalRequest(user.id, createDto);
  }
}
