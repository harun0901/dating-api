import { Module } from '@nestjs/common';

import { UsersModule } from '../sdate/users/users.module';
// import { BlogModule } from '../blog/blog.module';
// import { CommentModule } from '../comment/comment.module';
import { SeedService } from './seed.service';

@Module({
  // imports: [UsersModule, BlogModule, CommentModule],
  imports: [UsersModule],
  providers: [SeedService],
})
export class SeedModule {
}
