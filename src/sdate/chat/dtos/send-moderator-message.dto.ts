import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendModeratorMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly receiverId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @ApiProperty()
  @IsString()
  readonly gift: string;

  @ApiProperty()
  @IsString()
  readonly kiss: string;
}
