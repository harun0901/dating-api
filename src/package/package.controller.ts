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

import { PackageService } from '../package/package.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PackageEntity } from '../package/entities/package.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { RegisterPackageDto } from '../package/dtos/register-package.dto';
import { UpdatePackageDto } from '../package/dtos/update-package.dto';
import { IndexPackageDto } from './dtos/index-package.dto';

@ApiTags('Package')
@Controller('sdate/package')
export class PackageController {
  constructor(private packageService: PackageService) {}

  @Get('getAll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: PackageEntity })
  async getAll(@Request() req): Promise<PackageEntity[]> {
    return await this.packageService.find();
  }

  @Post('getByState')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: PackageEntity })
  async getByIndex(@Body() dto: IndexPackageDto): Promise<PackageEntity> {
    return await this.packageService.findByIndex(dto.index);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new gift' })
  @ApiOkResponse({ type: PackageEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Post('register')
  async register(@Body() dto: RegisterPackageDto): Promise<PackageEntity[]> {
    await this.packageService.registerPackage(dto);
    return await this.packageService.find();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register gift' })
  @ApiOkResponse({ type: PackageEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Admin])
  @Put('update')
  async update(@Body() dto: UpdatePackageDto): Promise<PackageEntity[]> {
    await this.packageService.updatePackageState(dto);
    return await this.packageService.find();
  }

}
