import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendModeratorMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  gift: string;

  @ApiProperty()
  @IsString()
  kiss: string;
}
