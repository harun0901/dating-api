import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class CategoryDto extends CommonDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly userList: UserEntity[];

  @ApiProperty()
  readonly state: number;
}
