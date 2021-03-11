import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class AddUserCategoryDto extends CommonDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly userIds: string[];
}
