import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { UploadModule } from './upload/upload.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    UsersModule,
    ChatModule,
    AuthModule,
    SocketModule,
    UploadModule,
    NotificationModule,
  ],
})
export class SdateModule {}
