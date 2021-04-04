import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({ description: `the customer id` })
  id: string;

  @ApiProperty({ description: `the data of customer` })
  data: string;
}
