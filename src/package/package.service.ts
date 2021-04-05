import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from '../package/entities/package.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterPackageDto } from '../package/dtos/register-package.dto';
import { getFromDto } from '../common/utils/repository.util';
import { UpdatePackageDto } from '../package/dtos/update-package.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(PackageEntity)
    private packageRepository: Repository<PackageEntity>,
  ) {}

  async registerPackage(
    dto: RegisterPackageDto,
    throwError = true,
  ): Promise<PackageEntity> {
    const packagePrice = getFromDto<PackageEntity>(dto, new PackageEntity());
    return this.packageRepository.save(packagePrice);
  }

  async updatePackageState(
    dto: UpdatePackageDto,
    throwError = true,
  ): Promise<PackageEntity> {
    const packagePrice = await this.findByIndex(dto.index);
    packagePrice.price = dto.price;
    packagePrice.credit = dto.credit;
    packagePrice.bonus = dto.bonus;
    return this.packageRepository.save(packagePrice);
  }

  async findByIndex(index: number): Promise<PackageEntity> {
    return this.packageRepository.findOne({ index });
  }

  async findById(id: string): Promise<PackageEntity> {
    return this.packageRepository.findOne({ id });
  }

  async updatePackage(packagePrice: PackageEntity): Promise<PackageEntity> {
    return this.packageRepository.save(packagePrice);
  }

  async count(): Promise<number> {
    return this.packageRepository.count();
  }

  async find(): Promise<PackageEntity[]> {
    return this.packageRepository.find({
      order: {
        index: 'ASC',
      },
    });
  }
}
