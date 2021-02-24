import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { UploadDto } from '../dtos/upload.dto';

@Entity('upload')
export class UploadEntity extends SoftDelete {
  @ManyToOne(() => UserEntity, (user) => user.upload)
  uploader: UserEntity;

  @Column()
  type: number;

  @Column()
  data: string;

  @Column()
  state: number;

  toDto(): UploadDto {
    return {
      ...super.toDto(),
      uploader: this.uploader,
      type: this.type,
      data: this.data,
      state: this.state,
    };
  }
}
