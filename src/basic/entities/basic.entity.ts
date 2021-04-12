import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { BasicDto } from '../dtos/basic.dto';

@Entity('basic')
export class BasicEntity extends SoftDelete {
  @Column({ default: '' })
  key: string;

  @Column({ default: '' })
  value: string;

  toDto(): BasicDto {
    return {
      ...super.toDto(),
      key: this.key,
      value: this.value,
    };
  }
}
