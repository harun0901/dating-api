import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class TransactionDto extends CommonDto {
  @ApiProperty({ description: `the payment payer` })
  payer: UserEntity;

  @ApiProperty({ description: `the payment amount` })
  amount: number;

  @ApiProperty({ description: `the payment type` })
  type: number;

  @ApiProperty({ description: `the payment balance` })
  balance: number;

  @ApiProperty({ description: `the payment state` })
  state: number;
}
