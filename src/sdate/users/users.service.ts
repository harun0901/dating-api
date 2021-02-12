import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from './enums';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }

  async findLikeRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['likedList'],
      where: { id },
    });
  }

  async findFavoriteRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['favoriteList'],
      where: { id },
    });
  }

  async addUser(dto: RegisterUserDto, throwErrors = true): Promise<UserEntity> {
    const found = await this.findByEmail(dto.email);
    if (found) {
      if (throwErrors) {
        throw new BadRequestException('Email is already used.');
      }
      return found;
    }
    const user = getFromDto<UserEntity>(dto, new UserEntity());
    user.role = UserRole.Customer;
    return this.userRepository.save(user);
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async find(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findRandomUser(
    limit_count: string,
    idList: string[],
  ): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder()
      .where('id NOT IN (:...ids)', { ids: idList })
      .orderBy('random()')
      .limit(Number.parseInt(limit_count))
      .getMany();
  }

  async findUsersByIds(idList: string[]): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: idList })
      .getMany();
  }
}
