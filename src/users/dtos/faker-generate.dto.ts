import { ApiProperty } from '@nestjs/swagger';

export class FakerGenerateDto {
  @ApiProperty({ description: `the faker count` })
  count: number;

  @ApiProperty({ description: `start age` })
  startAge: number;

  @ApiProperty({ description: `end age` })
  endAge: number;

  @ApiProperty({ description: `nameList` })
  nameList: string;

  @ApiProperty({ description: `location` })
  location: string;

  @ApiProperty({ description: `gender` })
  gender: string;

  @ApiProperty({ description: `country` })
  country: string;
}
