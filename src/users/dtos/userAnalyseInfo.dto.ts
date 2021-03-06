import { ApiProperty } from '@nestjs/swagger';

export class UserAnalyseInfoDto {
  @ApiProperty({ description: `the message count of user` })
  msgCount: number;

  @ApiProperty({ description: `the credit of user` })
  balance: number;
}
