import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class PurchaseTransactionDto {
  @ApiProperty({ required: true, description: 'The payer' })
  @IsNotEmpty()
  payer: UserEntity;

  @ApiProperty({ required: true, description: 'The sum of payment' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
