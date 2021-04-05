import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { PackageModule } from '../package/package.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, PackageModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
