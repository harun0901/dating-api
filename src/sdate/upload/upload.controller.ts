import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as uuid from 'uuid';

import { UserRole } from '../users/enums';
import { UploadService } from './upload.service';
import { UploadURLDto } from './dtos/uploadURL.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UploadFileNameDto } from './dtos/uploadFileName.dto';

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
}
