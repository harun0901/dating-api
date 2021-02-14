import { ApiProperty } from '@nestjs/swagger';

export class UserSearchDto {
  @ApiProperty({ description: `the lookingFor option` })
  lookingFor: string;

  @ApiProperty({ description: `the start age option` })
  startAge: number;

  @ApiProperty({ description: `the end age option` })
  endAge: number;

  @ApiProperty({ description: `the location option` })
  location: string;
}
