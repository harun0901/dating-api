import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TimeMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly timeRangeNum: number;
}
