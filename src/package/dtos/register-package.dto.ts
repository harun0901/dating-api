import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterPackageDto {
  @ApiProperty({ required: true, description: 'the package index' })
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @ApiProperty({ required: true, description: 'the package price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true, description: 'the package credit' })
  @IsNumber()
  @IsNotEmpty()
  credit: number;

  @ApiProperty({ required: true, description: 'the package bonus' })
  @IsNumber()
  @IsNotEmpty()
  bonus: number;
}
