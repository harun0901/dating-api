import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterBasicDto {
  @ApiProperty({ required: true, description: 'the basic key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: true, description: 'the basic value' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
