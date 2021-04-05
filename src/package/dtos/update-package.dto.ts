import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePackageDto {
  @ApiProperty({ required: true, description: 'The package index' })
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @ApiProperty({ required: true, description: 'The package price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true, description: 'The package credit' })
  @IsNumber()
  @IsNotEmpty()
  credit: number;

  @ApiProperty({ required: true, description: 'The package bonus' })
  @IsNumber()
  @IsNotEmpty()
  bonus: number;
}
