import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';
// import { CommentDto } from '../../comment/dtos/comment.dto';
// import { BlogDto } from '../../blog/dtos/blog.dto';

export class UserDto extends CommonDto {
  @ApiProperty({ description: `the user's full name` })
  fullName: string;

  @ApiProperty({ description: `the user's email address` })
  email: string;

  @ApiProperty({ type: 'enum', enum: UserRole, description: `the user's role` })
  role: UserRole;

  @ApiProperty({ description: `the user's gender` })
  gender: string;

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

  @ApiProperty({ description: `the user's birthday` })
  birthday: Date;

  @ApiProperty({ description: `the user's avatar` })
  avatar: string;
}
