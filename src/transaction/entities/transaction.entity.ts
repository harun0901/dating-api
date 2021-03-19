import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { TransactionDto } from '../dtos/transaction.dto';

@Entity('transaction')
export class TransactionEntity extends SoftDelete {
  @ManyToOne(() => UserEntity, (user) => user.transactionList)
  payer: UserEntity;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @Column()
  type: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 1 })
  state: number;

  toDto(): TransactionDto {
    return {
      ...super.toDto(),
      payer: this.payer,
      orderId: this.orderId,
      amount: this.amount,
      type: this.type,
      balance: this.balance,
      state: this.state,
    };
  }
}
