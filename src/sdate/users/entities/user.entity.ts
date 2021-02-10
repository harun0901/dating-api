import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserRole } from '../enums';
import { UserDto } from '../dtos/user.dto';
import { ChatEntity } from '../../chat/entities/chat.entity';

@Entity('user')
export class UserEntity extends SoftDelete {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: '' })
  gender: string;

  @Column({ default: '' })
  lookingFor: string;

  @Column({ default: '' })
  body: string;

  @Column({ default: '' })
  education: string;

  @Column({ default: '' })
  interestedIn: string;

  @Column({ default: '' })
  kids: string;

  @Column({ default: '' })
  profession: string;

  @Column({ default: '' })
  relationshipStatus: string;

  @Column({ default: '' })
  smoker: string;

  @Column({ default: '' })
  language: string;

  @Column({ default: '' })
  height: string;

  @Column({ default: '' })
  alcohol: string;

  @Column({ default: new Date() })
  birthday: Date;

  @Column({ default: '' })
  avatar: string;

  @OneToMany(() => ChatEntity, (chat) => chat.sender)
  sentChats?: ChatEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.receiver)
  receiveChats?: ChatEntity[];

  @BeforeInsert()
  preProcess() {
    return hash(this.password, 10).then(
      (encrypted) => (this.password = encrypted),
    );
  }

  toDto(): UserDto {
    return {
      ...super.toDto(),
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      gender: this.gender,
      lookingFor: this.lookingFor,
      body: this.body,
      education: this.education,
      interestedIn: this.interestedIn,
      kids: this.kids,
      profession: this.profession,
      relationshipStatus: this.relationshipStatus,
      smoker: this.smoker,
      language: this.language,
      height: this.height,
      alcohol: this.alcohol,
      birthday: this.birthday,
      avatar: this.avatar,
    };
  }
}
