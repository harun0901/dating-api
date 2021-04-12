import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BasicEntity } from './entities/basic.entity';
import { RegisterBasicDto } from './dtos/register-basic.dto';
import { getFromDto } from '../common/utils/repository.util';
import { UpdateBasicDto } from './dtos/update-basic.dto';

@Injectable()
export class BasicService {
  constructor(
    @InjectRepository(BasicEntity)
    private basicRepository: Repository<BasicEntity>,
  ) {}

  async registerBasic(
    dto: RegisterBasicDto,
    throwError = true,
  ): Promise<BasicEntity> {
    const basicData = getFromDto<BasicEntity>(dto, new BasicEntity());
    return this.basicRepository.save(basicData);
  }

  async updateBasicState(
    dto: UpdateBasicDto,
    throwError = true,
  ): Promise<BasicEntity> {
    const basicData = await this.findByKey(dto.key);
    basicData.value = dto.value;
    return this.basicRepository.save(basicData);
  }

  async findByKey(key: string): Promise<BasicEntity> {
    return this.basicRepository.findOne({ key });
  }

  async findById(id: string): Promise<BasicEntity> {
    return this.basicRepository.findOne({ id });
  }

  async updateBasic(packagePrice: BasicEntity): Promise<BasicEntity> {
    return this.basicRepository.save(packagePrice);
  }

  async count(): Promise<number> {
    return this.basicRepository.count();
  }

  async find(): Promise<BasicEntity[]> {
    return this.basicRepository.find({
      order: {
        key: 'ASC',
      },
    });
  }
}
