import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: `the user's id` })
  id: string;

  @ApiProperty({ description: `the user's password` })
  password: string;
}
