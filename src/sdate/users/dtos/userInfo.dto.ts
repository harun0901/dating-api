import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class UserInfoDto {
  @ApiProperty({ description: `the user's birthday` })
  birthday: Date;

  @ApiProperty({ description: `the user's email` })
  email: string;
}
