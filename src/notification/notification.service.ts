import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SocketService } from '../socket/socket.service';
import { NotificationEntity } from './entities/notification.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AddNotificationDto } from './dtos/addNotification.dto';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationState, NotificationType } from './enums';
import { Between, Not, Repository } from 'typeorm';
import { subMonths } from 'date-fns';
import { InboxDto } from './dtos/inbox.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationEntityRepository: Repository<NotificationEntity>,
    private readonly socketService: SocketService,
  ) {}

  async addNotification(
    pattern: string,
    sender: UserEntity,
    receiver: UserEntity,
  ): Promise<NotificationDto> {
    const notification = new NotificationEntity();
    notification.sender = sender;
    notification.receiver = receiver;
    notification.pattern = pattern;
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
        pattern: pattern,
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

  async findInboxList(receiver: UserEntity): Promise<NotificationDto[]> {
    const idList = await this.notificationEntityRepository
      .createQueryBuilder()
      .select('max(id)', 'id')
      .where('receiver.id = :recvId')
      .groupBy('sender.id')
      .addGroupBy('pattern')
      .setParameters({ recvId: receiver.id })
      .getRawMany();
    console.log('idList = ', idList);
    return this.notificationEntityRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: idList })
      .getMany();
  }

  async findByUser(receiver: UserEntity): Promise<NotificationDto[]> {
    const res = await this.notificationEntityRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        receiver: {
          id: receiver.id,
        },
      },
      order: {
        createdAt: 'ASC',
        seen: 'ASC',
      },
    });
    return res.map((one) => one.toDto());
  }

  async findNotSeenByUser(receiver: UserEntity): Promise<NotificationDto[]> {
    const res = await this.notificationEntityRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        receiver: {
          id: receiver.id,
        },
        seen: NotificationState.NotSeen,
      },
      order: {
        createdAt: 'ASC',
      },
    });
    return res.map((one) => one.toDto());
  }

  async likeCount(): Promise<number> {
    const BeforeDate = (date: Date) => Between(subMonths(date, 1), date);
    const list = await this.notificationEntityRepository.find({
      where: {
        pattern: NotificationType.Like,
        createdAt: BeforeDate(new Date()),
      },
    });
    return list.length;
  }

  async favoriteCount(): Promise<number> {
    const BeforeDate = (date: Date) => Between(subMonths(date, 1), date);
    const list = await this.notificationEntityRepository.find({
      where: {
        pattern: NotificationType.Favorite,
        createdAt: BeforeDate(new Date()),
      },
    });
    return list.length;
  }

  async visitCount(): Promise<number> {
    const BeforeDate = (date: Date) => Between(subMonths(date, 1), date);
    const list = await this.notificationEntityRepository.find({
      where: {
        pattern: NotificationType.Visit,
        createdAt: BeforeDate(new Date()),
      },
    });
    return list.length;
  }

  async deleteById(id: string): Promise<void> {
    const item = await this.notificationEntityRepository.findOne({ id });
    await this.notificationEntityRepository.remove(item);
  }

  async deleteByItem(payload: InboxDto): Promise<void> {
    await this.notificationEntityRepository
      .createQueryBuilder()
      .delete()
      .where('sender.id = :senderId', { senderId: payload.senderId })
      .andWhere('receiver.id = :receiverId', { receiverId: payload.receiverId })
      .andWhere('pattern = :patternStr', { patternStr: payload.pattern })
      .execute();
  }

  async updateByItem(payload: InboxDto): Promise<void> {
    await this.notificationEntityRepository
      .createQueryBuilder()
      .update()
      .set({ seen: NotificationState.Seen })
      .where('sender.id = :senderId', { senderId: payload.senderId })
      .andWhere('receiver.id = :receiverId', { receiverId: payload.receiverId })
      .andWhere('pattern = :patternStr', { patternStr: payload.pattern })
      .execute();
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
