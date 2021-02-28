import {
  Body,
  Controller,
  Get,
  Param,
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
import * as uuid from 'uuid';

import { UserRole } from '../users/enums';
import { UploadService } from './upload.service';
import { UploadURLDto } from './dtos/uploadURL.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UploadFileNameDto } from './dtos/uploadFileName.dto';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { SendUploadDto } from './dtos/sendUpload.dto';
import { UploadEntity } from './entities/upload.entity';
import { UpdateUploadDto } from './dtos/update-upload.dto';
import { GetUploadDto } from './dtos/get-upload.dto';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Upload')
@Controller('sdate/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Upload image Url' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('getUploadURL')
  async getUploadURL(
    @Request() req,
    @Body() dto: UploadFileNameDto,
  ): Promise<UploadURLDto> {
    let res = '';
    let tmpFileName = '';
    if (dto.fileName.length > 0) {
      tmpFileName = `${uuid.v4()}_${dto.fileName}`;
      res = await this.uploadService.getUploadURL(tmpFileName);
    }
    return { uploadURL: res, uploadFileName: tmpFileName };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new uploadFile' })
  @ApiOkResponse({ type: TransactionEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('register')
  register(@Body() dto: SendUploadDto): Promise<UploadEntity> {
    return this.uploadService.registerUpload(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ type: UploadEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('update')
  update(@Body() dto: UpdateUploadDto): Promise<UploadEntity> {
    return this.uploadService.updateUpload(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Enable Uploads' })
  @ApiOkResponse({ type: UploadEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('getByIdState')
  getByIdState(@Body() dto: GetUploadDto): Promise<UploadEntity[]> {
    return this.uploadService.findByUserIdSate(dto);
  }

  @Get('getById/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiImplicitParam({ name: 'userId', required: true })
  @ApiOkResponse({ type: UploadEntity })
  async getUserById(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UploadEntity[]> {
    return await this.uploadService.findByUserId(userId);
  }
}
