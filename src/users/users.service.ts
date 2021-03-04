import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';

import { UserRole } from './enums';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { getFromDto } from '../common/utils/repository.util';
import { NotificationType } from '../notification/enums';
import { UserSearchDto } from './dtos/userSearch.dto';
import { subHours, subMinutes } from 'date-fns';

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

  async findNewUsers(): Promise<UserEntity[]> {
    const BeforeDate = (date: Date) => Between(subMinutes(date, 15), date);
    const res = await this.userRepository.find({
      where: {
        role: UserRole.Customer,
        createdAt: BeforeDate(new Date()),
      },
    });
    return res;
  }

  async findByRole(roleStr: UserRole): Promise<UserEntity[]> {
    return this.userRepository.find({
      role: roleStr,
    });
  }

  async findLikeRelationById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: ['likedList'],
      where: {
        id,
      },
    });
  }

  async findVisitUsers(id: string): Promise<UserEntity[]> {
    const owner = await this.userRepository.findOne({
      relations: [
        'receiveNotifications',
        'receiveNotifications.sender',
        'receiveNotifications.receiver',
      ],
      where: { id },
    });
    const userIdList = [];
    const res = owner.receiveNotifications
      .filter((value) => value.pattern === NotificationType.Visit)
      .map((item) => item.sender)
      .filter((value, index, self) => {
        if (userIdList.indexOf(value.id) >= 0) {
          return false;
        } else {
          userIdList.push(value.id);
          return true;
        }
      });
    return res;
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
    searchKey: UserSearchDto,
  ): Promise<UserEntity[]> {
    if (searchKey.ignoreFlag) {
      return this.userRepository
        .createQueryBuilder()
        .where('id NOT IN (:...ids)', { ids: idList })
        .orderBy('random()')
        .limit(Number.parseInt(limit_count))
        .getMany();
    } else {
      const curDate = new Date();
      const endYear = curDate.getFullYear() - searchKey.startAge;
      const startYear = curDate.getFullYear() - searchKey.endAge;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear, 11, 31);
      return this.userRepository
        .createQueryBuilder()
        .where('id NOT IN (:...ids)', { ids: idList })
        .andWhere('gender = (:lookingFor)', {
          lookingFor: searchKey.lookingFor,
        })
        .andWhere('birthday >= (:startDate)', {
          startDate: startDate,
        })
        .andWhere('birthday <= (:endDate)', {
          endDate: endDate,
        })
        .andWhere('location like (:location)', {
          location: `%${searchKey.location}%`,
        })
        .orderBy('random()')
        .limit(Number.parseInt(limit_count))
        .getMany();
    }
  }

  async findUsersByIds(idList: string[]): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: idList })
      .getMany();
  }
}
