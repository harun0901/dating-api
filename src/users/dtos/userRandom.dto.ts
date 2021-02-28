import { ApiProperty } from '@nestjs/swagger';
import { UserSearchDto } from './userSearch.dto';

export class userRandomDto {
  @ApiProperty({ description: `get the limit count of objects` })
  limit_count: string;

  @ApiProperty({ description: `get the searchKey of objects` })
  searchKey: UserSearchDto;
}
