import { ApiProperty } from '@nestjs/swagger';

export class NotificationIdDto {
  @ApiProperty({ description: `the notification id` })
  id: string;
}
