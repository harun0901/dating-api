import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { RegisterTransactionDto } from '../transaction/dtos/register-transaction.dto';
import { getFromDto } from '../common/utils/repository.util';
import { UpdateTransactionDto } from '../transaction/dtos/update-transaction.dto';
import { CategoryEntity } from './entities/category.entity';
import { RegisterCategoryDto } from './dtos/register-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private userService: UsersService,
  ) {}

  async findByUserName(name: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      relations: ['userList'],
      where: {
        name: name,
      },
    });
  }

  async register(
    dto: RegisterCategoryDto,
    throwError = true,
  ): Promise<CategoryEntity> {
    const item = getFromDto<CategoryEntity>(dto, new CategoryEntity());
    item.userList = [];
    return this.categoryRepository.save(item);
  }

  async updateCategory(
    dto: UpdateCategoryDto,
    throwError = true,
  ): Promise<CategoryEntity> {
    const item = await this.findById(dto.id);
    item.name = dto.name;
    item.state = dto.state;
    return this.categoryRepository.save(item);
  }

  async findByState(state: number): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      where: {
        state: state,
      },
    });
  }

  async findById(id: string): Promise<CategoryEntity> {
    return this.categoryRepository.findOne({
      relations: ['userList'],
      where: {
        id,
      },
    });
  }

  async updateEntity(entity: CategoryEntity): Promise<CategoryEntity> {
    return this.categoryRepository.save(entity);
  }

  async count(): Promise<number> {
    return this.categoryRepository.count();
  }

  async find(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }
}
