import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class NotificationDto extends CommonDto {
  @ApiProperty({ description: `the notification sender` })
  sender: UserEntity;

  @ApiProperty({ description: `the notification receiver` })
  receiver: UserEntity;

  @ApiProperty({ description: `the notification pattern` })
  pattern: string;

  @ApiProperty({ description: `the notification state` })
  seen: number;
}
