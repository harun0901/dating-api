import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { ChatDto } from '../dtos/chat.dto';

@Entity('chat')
export class ChatEntity extends SoftDelete {
  @ManyToOne(() => UserEntity, (user) => user.sentChats)
  sender: UserEntity;

  @Column({ default: 0 })
  sender_delete: number;

  @ManyToOne(() => UserEntity, (user) => user.receiveChats)
  receiver: UserEntity;

  @Column({ default: 0 })
  receiver_delete: number;

  @Column({ default: '' })
  text: string;

  @Column({ default: '' })
  gift: string;

  @Column({ default: '' })
  kiss: string;

  @Column({ default: '' })
  gif: string;

  @Column({ default: '' })
  other: string;

  @Column({ default: 0 })
  seen: number;

  // @Column({
  //   type: 'enums',
  //   enums: ChatType,
  //   default: ChatType.ProjectConsultation,
  // })
  // type: ChatType;

  toDto(): ChatDto {
    return {
      id: this.id,
      sender: this.sender,
      sender_delete: this.sender_delete,
      receiver: this.receiver,
      receiver_delete: this.receiver_delete,
      text: this.text,
      gift: this.gift,
      kiss: this.kiss,
      gif: this.gif,
      seen: this.seen,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
