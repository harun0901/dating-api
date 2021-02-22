import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterTransactionDto {
  @ApiProperty({ required: true, description: 'The Id of payer' })
  @IsNotEmpty()
  payer_id: string;

  @ApiProperty({ required: true, description: 'The amount of payment' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ required: true, description: 'The payment type' })
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ required: true, description: 'The payer balance' })
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @ApiProperty({ required: true, description: 'The transaction state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
