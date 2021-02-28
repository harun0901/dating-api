import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';

import { UsersService } from '../users/users.service';
import {
  mailDomain,
  seedAdminUser,
  seedGeneralUser,
  seedModeratorUser,
  seedPassword,
  seedSuperAdminUser,
} from './data/user.data';
import { Gender, UserRole } from '../users/enums';
import { seedGeneralUserCount, seedModeratorCount } from './consts';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(private userService: UsersService) {}

  async start() {
    await this.seedUsers();
  }

  async seedUsers() {
    console.log('Start adding seed users...');
    const userCount = await this.userService.count();
    if (userCount) {
      console.log('Skipped user seed');
      return;
    }

    // seed super admin user
    console.log('Adding super admin user...');
    const superadmin = await this.userService.addUser(seedSuperAdminUser);
    superadmin.role = UserRole.SuperAdmin;
    superadmin.gender = Gender.Man;
    await this.userService.updateUser(superadmin);

    // seed admin user
    console.log('Adding admin user...');
    const admin = await this.userService.addUser(seedAdminUser);
    admin.role = UserRole.Admin;
    admin.gender = Gender.Man;
    await this.userService.updateUser(admin);

    // seed moderator users
    console.log('Adding moderator users...');
    const defaultModerator = await this.userService.addUser(seedModeratorUser);
    defaultModerator.role = UserRole.Moderator;
    defaultModerator.gender = Gender.Woman;
    await this.userService.updateUser(defaultModerator);
    for (let i = 0; i < seedModeratorCount; i++) {
      await this.addUserWithRole(UserRole.Moderator);
    }

    // seed general users
    console.log('Adding general users...');
    const defaultGeneralUser = await this.userService.addUser(seedGeneralUser);
    defaultGeneralUser.role = UserRole.Customer;
    defaultGeneralUser.gender = Gender.Man;
    await this.userService.updateUser(defaultGeneralUser);
    for (let i = 0; i < seedGeneralUserCount; i++) {
      await this.addUserWithRole(UserRole.Customer);
    }
    console.log('Finished adding seed users.');
  }

  // async seedBlogs() {
  //   console.log('Start adding seed blogs...');
  //   const count = await this.blogService.count();
  //   if (count) {
  //     console.log('skipped blog seed');
  //     return;
  //   }
  //   const users = await this.userService.find();
  //   await Promise.all(users.map(async user => {
  //     console.log(`Adding seed blogs for user ${user.email}...`);
  //     for (let i = 0; i < seedBlogCountPerUser; i++) {
  //       const title = Faker.lorem.sentence(seedBlogTitleWordCount);
  //       const content = Faker.lorem.sentence(seedBlogContentWordCount);
  //       await this.blogService.add(user, { title, content });
  //     }
  //   }));
  //   console.log('Finished adding seed blogs.');
  // }
  //
  // async seedComments() {
  //   console.log('Start adding seed comments...');
  //   const count = await this.commentService.count();
  //   if (count) {
  //     console.log('skipped comment seed');
  //     return;
  //   }
  //   const users = await this.userService.find();
  //   const blogs = await this.blogService.find();
  //   await Promise.all(blogs.map(async blog => {
  //     console.log(`Adding seed comments for blog "${blog.title.substr(20)}"...`);
  //     for (let i = 0; i < seedCommentCountPerBlog; i++) {
  //       const content = Faker.lorem.sentence(seedCommentWordCount);
  //       const author = Faker.random.arrayElement(users);
  //       await this.commentService.add(author, blog, { content });
  //     }
  //   }));
  //   console.log('Finished adding seed comments.');
  // }

  private async addUserWithRole(role: UserRole): Promise<UserEntity> {
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const user = await this.userService.addUser({
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${mailDomain}`,
      password: seedPassword,
      gender: Faker.gender,
    });
    user.role = role;
    user.birthday = Faker.date.between('1966-01-01', '2001-12-30');
    user.avatar = Faker.image.imageUrl(150, 150, 'people');
    user.avatar = `${Faker.image.imageUrl(
      150,
      150,
      'people',
    )}?random=${Date.now()}`;
    user.location = Faker.address.country();
    user.gender = Faker.name.gender();
    console.log(user);
    return this.userService.updateUser(user);
  }
}
