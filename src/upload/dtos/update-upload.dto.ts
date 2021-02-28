import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUploadDto {
  @ApiProperty({ required: true, description: 'The Id of upload' })
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({ required: true, description: 'The uploads type' })
  @IsNotEmpty()
  data: string;

  @ApiProperty({ required: true, description: 'The upload state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
