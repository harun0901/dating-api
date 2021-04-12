import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';

export class IndexBasicDto extends CommonDto {
  @ApiProperty({ description: `the key of basic` })
  key: string;
}
