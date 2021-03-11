import { Column, Entity, ManyToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryDto } from '../dtos/category.dto';

@Entity('category')
export class CategoryEntity extends SoftDelete {
  @Column({ default: '' })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.categoryList)
  userList: UserEntity[];

  @Column({ default: 0 })
  state: number;

  toDto(): CategoryDto {
    return {
      id: this.id,
      name: this.name,
      userList: this.userList,
      state: this.state,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
