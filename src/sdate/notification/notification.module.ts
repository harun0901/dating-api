import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    UsersModule,
    SocketModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
