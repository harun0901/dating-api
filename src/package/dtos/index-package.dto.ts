import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class IndexPackageDto extends CommonDto {
  @ApiProperty({ description: `the package index` })
  index: number;
}
