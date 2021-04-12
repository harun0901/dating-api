import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BasicEntity } from './entities/basic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasicEntity]), UsersModule, AuthModule],
  controllers: [BasicController],
  providers: [BasicService],
  exports: [BasicService],
})
export class BasicModule {}
