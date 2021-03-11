import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UsersModule } from '../users/users.module';
import { SocketModule } from '../socket/socket.module';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    UsersModule,
    SocketModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
