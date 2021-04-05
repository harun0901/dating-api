import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateGiftDto {
  @ApiProperty({ required: true, description: 'The id of gift' })
  @IsString()
  @IsNotEmpty()
  giftId: string;

  @ApiProperty({ required: true, description: 'The gift price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true, description: 'The gift state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
