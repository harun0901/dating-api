import { ApiProperty } from '@nestjs/swagger';

export class RegisterCategoryDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly state: number;
}
