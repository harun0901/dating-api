import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { PackageModule } from '../package/package.module';
import { BasicModule } from '../basic/basic.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, PackageModule, BasicModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
