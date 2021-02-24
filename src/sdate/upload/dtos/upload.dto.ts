import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class UploadDto extends CommonDto {
  @ApiProperty()
  readonly uploader: UserEntity;

  @ApiProperty()
  readonly type: number;

  @ApiProperty()
  readonly data: string;

  @ApiProperty()
  readonly state: number;
}
