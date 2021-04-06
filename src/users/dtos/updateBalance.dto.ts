import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({ description: `the change amount` })
  amount: number;
}
