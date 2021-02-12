import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('sdate/upload')
export class UploadController {
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserDto })
  // @ApiOperation({ summary: 'Get user info' })
  // @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file) {
    console.log('upload request arrived');
    console.log(file);
  }
}
