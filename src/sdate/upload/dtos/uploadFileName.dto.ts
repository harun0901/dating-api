import { ApiProperty } from '@nestjs/swagger';

export class UploadFileNameDto {
  @ApiProperty({ description: `the upload file Name` })
  fileName: string;
}
