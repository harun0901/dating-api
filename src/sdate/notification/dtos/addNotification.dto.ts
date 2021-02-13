import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class AddNotificationDto extends CommonDto {
  @ApiProperty({ description: `the notification receiver` })
  receiver_id: string;

  @ApiProperty({ description: `the notification pattern` })
  pattern: string;
}
