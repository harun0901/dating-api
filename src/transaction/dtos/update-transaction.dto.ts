import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({ required: true, description: 'The Id of transaction' })
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ required: true, description: 'The payer balance' })
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @ApiProperty({ required: true, description: 'The transaction state' })
  @IsNumber()
  @IsNotEmpty()
  state: number;
}
