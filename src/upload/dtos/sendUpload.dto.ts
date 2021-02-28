import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class SendUploadDto {
  @ApiProperty()
  uploaderId: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  data: string;

  @ApiProperty()
  state: number;
}
