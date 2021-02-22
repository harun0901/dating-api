import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StateGiftDto {
  @ApiProperty({ required: true, description: 'The transaction state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
