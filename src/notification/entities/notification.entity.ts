import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { NotificationDto } from '../dtos/notification.dto';

@Entity('notification')
export class NotificationEntity extends SoftDelete {
  @ManyToOne(() => UserEntity, (user) => user.sentChats)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receiveChats)
  receiver: UserEntity;

  @Column({ default: '' })
  pattern: string;

  @Column({ default: '' })
  content: string;

  @Column({ default: 0 })
  seen: number;

  toDto(): NotificationDto {
    return {
      ...super.toDto(),
      sender: this.sender,
      receiver: this.receiver,
      pattern: this.pattern,
      content: this.content,
      seen: this.seen,
    };
  }
}
