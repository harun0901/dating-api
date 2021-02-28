import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ required: true, description: 'Full name of the new user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: true, description: 'Email address of the new user' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: 'Password for the new user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, description: 'Gender for the new user' })
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @ApiProperty({ required: true, description: 'Birthday for the new user' })
  @IsString()
  @IsNotEmpty()
  birthday?: Date;

  @ApiProperty({ required: true, description: 'LookingFor for the new user' })
  @IsString()
  @IsNotEmpty()
  lookingFor?: string;
}
