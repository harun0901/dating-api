import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetModeratorMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly receiverId: string;
}
