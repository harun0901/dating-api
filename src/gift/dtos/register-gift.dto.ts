import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterGiftDto {
  @ApiProperty({ required: true, description: 'The path of gift' })
  @IsNotEmpty()
  path: string;

  @ApiProperty({ required: true, description: 'The gift price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true, description: 'The gift state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
