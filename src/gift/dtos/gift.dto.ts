import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class GiftDto extends CommonDto {
  @ApiProperty({ description: `the gift path` })
  path: string;

  @ApiProperty({ description: `the gift price` })
  price: number;

  @ApiProperty({ description: `the gift state` })
  state: number;
}
