import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { UploadModule } from './upload/upload.module';
import { NotificationModule } from './notification/notification.module';
import { TransactionModule } from './transaction/transaction.module';
import { GiftModule } from './gift/gift.module';

@Module({
  imports: [
    UsersModule,
    ChatModule,
    AuthModule,
    SocketModule,
    UploadModule,
    NotificationModule,
    TransactionModule,
    GiftModule,
  ],
})
export class SdateModule {}
