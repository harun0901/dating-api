import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { GiftDto } from '../dtos/gift.dto';

@Entity('gift')
export class GiftEntity extends SoftDelete {
  @Column()
  path: string;

  @Column({ default: 1 })
  state: number;

  toDto(): GiftDto {
    return {
      ...super.toDto(),
      path: this.path,
      state: this.state,
    };
  }
}
