import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';

export class UpdateUserDto {
  @ApiProperty({ description: `the user's id` })
  id: string;

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

  @ApiProperty({ description: `the user's location` })
  location: string;

  @ApiProperty({ description: `the user's balance` })
  balance: number;

  @ApiProperty({ description: `the user's description` })
  about: string;

  @ApiProperty({ description: `the user's state` })
  state: number;
  //
  // @ApiProperty({ description: `the user's paypal address` })
  // paypal: string;
  //
  // @ApiProperty({ description: `the user's state` })
  // state: number;
  //
  // @ApiProperty({ description: `the user's ipAddress` })
  // ipAddress: string;
  //
  // @ApiProperty({ description: `the user's lastlogin date` })
  // lastLogin: Date;
}
