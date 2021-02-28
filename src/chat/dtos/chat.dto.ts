import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class ChatDto extends CommonDto {
  @ApiProperty()
  readonly sender: UserEntity;

  @ApiProperty()
  readonly sender_delete: number;

  @ApiProperty()
  readonly receiver: UserEntity;

  @ApiProperty()
  readonly receiver_delete: number;

  @ApiProperty()
  readonly text: string;

  @ApiProperty()
  readonly gift: string;

  @ApiProperty()
  readonly kiss: string;

  @ApiProperty()
  readonly seen: number;
}
