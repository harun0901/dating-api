import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUploadDto {
  @ApiProperty({ required: true, description: 'The Id of uploader' })
  @IsNotEmpty()
  uploaderId: string;

  @ApiProperty({ required: true, description: 'The upload state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
