import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Mailing } from './schema/mailing.schema';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TJwtRequest } from 'src/types/jwtRequest';
import { CreateMailingDTO } from './dto/create-mailing.dto';

@UseGuards(JwtGuard)
@ApiTags('mailing')
@ApiBearerAuth()
@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @ApiOperation({
    summary: 'Создать рассылку',
  })
  @Post()
  createMailing(
    @Req() { user }: TJwtRequest,
    @Body() createMailingDTO: CreateMailingDTO,
  ): Promise<Mailing> {
    return this.mailingService.create(user._id, createMailingDTO);
  }
}
