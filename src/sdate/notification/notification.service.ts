import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SocketService } from '../socket/socket.service';
import { NotificationEntity } from './entities/notification.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AddNotificationDto } from './dtos/addNotification.dto';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationState } from './enums';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationEntityRepository: Repository<NotificationEntity>,
    private readonly socketService: SocketService,
  ) {}

  async addNotification(
    payload: AddNotificationDto,
    sender: UserEntity,
    receiver: UserEntity,
  ): Promise<NotificationDto> {
    const notification = new NotificationEntity();
    notification.sender = sender;
    notification.receiver = receiver;
    notification.pattern = payload.pattern;
    notification.seen = NotificationState.NotSeen;

    const [
      notificationList,
      notificationCount,
    ] = await this.notificationEntityRepository.findAndCount({
      where: {
        sender: {
          id: sender.id,
        },
        receiver: {
          id: receiver.id,
        },
        pattern: payload.pattern,
        seen: NotificationState.NotSeen,
      },
    });
    if (notificationCount === 0) {
      const res = await this.notificationEntityRepository.save(notification);
      this.socketService.event$.next(notification.toDto());
      return res.toDto();
    } else {
      return NotificationEntity[0];
    }
  }

  async findByUser(receiver: UserEntity): Promise<NotificationDto[]> {
    const res = await this.notificationEntityRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        receiver: {
          id: receiver.id,
        },
        seen: NotificationState.NotSeen,
      },
    });
    return res.map((one) => one.toDto());
  }

  async findById(id: string): Promise<NotificationEntity> {
    return this.notificationEntityRepository.findOne({ id });
  }

  async update(item: NotificationEntity): Promise<NotificationEntity> {
    return this.notificationEntityRepository.save(item);
  }

  async count(): Promise<number> {
    return this.notificationEntityRepository.count();
  }

  async find(): Promise<NotificationEntity[]> {
    return this.notificationEntityRepository.find();
  }
}
