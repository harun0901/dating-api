import { ApiProperty } from '@nestjs/swagger';

export class InboxDto {
  @ApiProperty({ description: `the notification sender id` })
  senderId: string;

  @ApiProperty({ description: `the notification receiver id` })
  receiverId: string;

  @ApiProperty({ description: `the notification pattern` })
  pattern: string;

  @ApiProperty({ description: `the notification content` })
  content: string;
}
