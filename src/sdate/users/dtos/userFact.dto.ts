import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class UserFactDto {
  @ApiProperty({ description: `the user's looking for option` })
  lookingFor: string;

  @ApiProperty({ description: `the user's body type` })
  body: string;

  @ApiProperty({ description: `the user's education` })
  education: string;

  @ApiProperty({ description: `the user's interestedIn` })
  interestedIn: string;

  @ApiProperty({ description: `the user's kids` })
  kids: string;

  @ApiProperty({ description: `the user's profession` })
  profession: string;

  @ApiProperty({ description: `the user's relationship status` })
  relationshipStatus: string;

  @ApiProperty({ description: `the user's smoker` })
  smoker: string;

  @ApiProperty({ description: `the user's language` })
  language: string;

  @ApiProperty({ description: `the user's height` })
  height: string;

  @ApiProperty({ description: `the user's alcohol` })
  alcohol: string;
}
