import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { getFromDto } from '../common/utils/repository.util';
import { GiftEntity } from './entities/gift.entity';
import { RegisterGiftDto } from './dtos/register-gift.dto';
import { UpdateGiftDto } from './dtos/update-gift.dto';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftEntity)
    private giftRepository: Repository<GiftEntity>,
    private userService: UsersService,
  ) {}

  async registerGift(
    dto: RegisterGiftDto,
    throwError = true,
  ): Promise<GiftEntity> {
    const gift = getFromDto<GiftEntity>(dto, new GiftEntity());
    return this.giftRepository.save(gift);
  }

  async updateGiftState(
    dto: UpdateGiftDto,
    throwError = true,
  ): Promise<GiftEntity> {
    const gift = await this.findById(dto.giftId);
    gift.state = dto.state;
    gift.price = dto.price;
    return this.giftRepository.save(gift);
  }

  async findById(id: string): Promise<GiftEntity> {
    return this.giftRepository.findOne({ id });
  }

  async updateGift(gift: GiftEntity): Promise<GiftEntity> {
    return this.giftRepository.save(gift);
  }

  async count(): Promise<number> {
    return this.giftRepository.count();
  }

  async find(): Promise<GiftEntity[]> {
    return this.giftRepository.find();
  }

  async findByState(state: number): Promise<GiftEntity[]> {
    return this.giftRepository.find({
      where: {
        state: state,
      },
      order: {
        id: 'ASC',
      },
    });
  }
}
