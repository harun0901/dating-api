import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';

export class BasicDto extends CommonDto {
  @ApiProperty({ description: `the basic data key` })
  key: string;

  @ApiProperty({ description: `the basic data value` })
  value: string;
}
