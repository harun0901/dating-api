import { ApiProperty } from '@nestjs/swagger';

export class UploadURLDto {
  @ApiProperty({ description: `the upload image url` })
  uploadURL: string;
  uploadFileName: string;
}
