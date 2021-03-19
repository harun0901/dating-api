import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionEntity } from './entities/transaction.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { TokenResponse } from '../common/models/token.response';
import { RegisterTransactionDto } from './dtos/register-transaction.dto';
import { getFromDto } from '../common/utils/repository.util';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/enums';
import { UsersService } from '../users/users.service';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { PurchaseTransactionDto } from './dtos/purchase-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private userService: UsersService,
  ) {}

  async findAll(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      relations: ['payer'],
    });
  }

  async findByUserId(userId: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        payer: {
          id: userId,
        },
      },
    });
  }

  async getPurchase(): Promise<any> {
    const ret = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.payer', 'payer')
      .addSelect('SUM(transaction.amount)', 'amount')
      .groupBy('transaction.payer');
    return ret;
  }

  async registerTransaction(
    dto: RegisterTransactionDto,
    throwError = true,
  ): Promise<TransactionEntity> {
    const transaction = getFromDto<TransactionEntity>(
      dto,
      new TransactionEntity(),
    );
    transaction.payer = await this.userService.findById(dto.payer_id);
    return this.transactionRepository.save(transaction);
  }

  async updateTransaction(
    dto: UpdateTransactionDto,
    throwError = true,
  ): Promise<TransactionEntity> {
    const transaction = await this.findById(dto.transactionId);
    transaction.balance = dto.balance;
    transaction.state = dto.state;
    return this.transactionRepository.save(transaction);
  }

  async findById(id: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({ id });
  }

  async updateUser(transaction: TransactionEntity): Promise<TransactionEntity> {
    return this.transactionRepository.save(transaction);
  }

  async count(): Promise<number> {
    return this.transactionRepository.count();
  }

  async find(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find();
  }
}
