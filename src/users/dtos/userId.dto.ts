import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({ description: `the like user id` })
  id: string;
}
