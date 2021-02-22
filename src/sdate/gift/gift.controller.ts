import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserRole } from '../users/enums';
import { GiftService } from './gift.service';
import { GiftEntity } from './entities/gift.entity';
import { UpdateGiftDto } from './dtos/update-gift.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { RegisterGiftDto } from './dtos/register-gift.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StateGiftDto } from './dtos/state-gift.dto';
import { GiftState } from './enums';

@ApiTags('Gift')
@Controller('sdate/gift')
export class GiftController {
  constructor(private giftService: GiftService) {}

  @Get('getAll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: GiftEntity })
  async getAll(@Request() req): Promise<GiftEntity[]> {
    return await this.giftService.find();
  }

  @Post('getByState')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: GiftEntity })
  async getByState(@Body() dto: StateGiftDto): Promise<GiftEntity[]> {
    return await this.giftService.findByState(dto.state);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new gift' })
  @ApiOkResponse({ type: GiftEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Post('register')
  async register(@Body() dto: RegisterGiftDto): Promise<GiftEntity[]> {
    await this.giftService.registerGift(dto);
    return await this.giftService.findByState(GiftState.ACCEPTED);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register gift' })
  @ApiOkResponse({ type: GiftEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Put('update')
  async update(@Body() dto: UpdateGiftDto): Promise<GiftEntity[]> {
    await this.giftService.updateGiftState(dto);
    return await this.giftService.findByState(GiftState.ACCEPTED);
  }
}
