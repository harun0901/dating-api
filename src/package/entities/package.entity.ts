import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PackageDto } from '../dtos/package.dto';

@Entity('package')
export class PackageEntity extends SoftDelete {
  @Column({ default: 1 })
  index: number;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  credit: number;

  @Column({ default: 0 })
  bonus: number;

  toDto(): PackageDto {
    return {
      ...super.toDto(),
      index: this.index,
      price: this.price,
      credit: this.credit,
      bonus: this.bonus,
    };
  }
}
