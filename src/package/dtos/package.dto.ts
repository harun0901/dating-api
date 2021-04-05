import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class PackageDto extends CommonDto {
  @ApiProperty({ description: `the package index` })
  index: number;

  @ApiProperty({ description: `the package price` })
  price: number;

  @ApiProperty({ description: `the package credit` })
  credit: number;

  @ApiProperty({ description: `the package bonus` })
  bonus: number;
}
