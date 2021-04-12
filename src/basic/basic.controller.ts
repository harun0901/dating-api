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

import { BasicService } from './basic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BasicEntity } from './entities/basic.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { RegisterBasicDto } from './dtos/register-basic.dto';
import { UpdateBasicDto } from './dtos/update-basic.dto';
import { IndexBasicDto } from './dtos/index-basic.dto';

@ApiTags('Basic')
@Controller('sdate/basic')
export class BasicController {
  constructor(private basicService: BasicService) {}

  @Get('getAll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: BasicEntity })
  async getAll(@Request() req): Promise<BasicEntity[]> {
    return await this.basicService.find();
  }

  @Post('getByState')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: BasicEntity })
  async getByIndex(@Body() dto: IndexBasicDto): Promise<BasicEntity> {
    return await this.basicService.findByKey(dto.key);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new basic' })
  @ApiOkResponse({ type: BasicEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Post('register')
  async register(@Body() dto: RegisterBasicDto): Promise<BasicEntity[]> {
    await this.basicService.registerBasic(dto);
    return await this.basicService.find();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register gift' })
  @ApiOkResponse({ type: BasicEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Put('update')
  async update(@Body() dto: UpdateBasicDto): Promise<BasicEntity[]> {
    await this.basicService.updateBasicState(dto);
    return await this.basicService.find();
  }
}
