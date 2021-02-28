import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class UserBasicDto {
  @ApiProperty({ description: `the user's fullName option` })
  fullName: string;

  @ApiProperty({ description: `the user's location type` })
  location: string;

  @ApiProperty({ description: `the user's description` })
  about: string;
}
