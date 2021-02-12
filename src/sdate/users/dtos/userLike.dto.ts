import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class UserLikeDto {
  @ApiProperty({ description: `the like user id` })
  id: string;
}
