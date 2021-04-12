import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './ormconfig';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { NotificationModule } from './notification/notification.module';
import { TransactionModule } from './transaction/transaction.module';
import { GiftModule } from './gift/gift.module';
import { CategoryModule } from './category/category.module';
import { PackageModule } from './package/package.module';
import { BasicModule } from './basic/basic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig()),
    SeedModule,
    UsersModule,
    ChatModule,
    AuthModule,
    UploadModule,
    NotificationModule,
    TransactionModule,
    GiftModule,
    CategoryModule,
    PackageModule,
    BasicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
