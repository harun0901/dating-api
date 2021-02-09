import { ApiProperty } from '@nestjs/swagger';

export class LimitCountDto {
  @ApiProperty({ description: `get the limit count of objects` })
  limit_count: string;
}
