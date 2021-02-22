import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './entities/transaction.entity';
import { TokenResponse } from '../common/models/token.response';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { RegisterTransactionDto } from './dtos/register-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@ApiTags('Transaction')
@Controller('sdate/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('getById/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiImplicitParam({ name: 'userId', required: true })
  @ApiOkResponse({ type: TransactionEntity })
  async getUserById(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<TransactionEntity[]> {
    return await this.transactionService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new transaction' })
  @ApiOkResponse({ type: TransactionEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('register')
  register(@Body() dto: RegisterTransactionDto): Promise<TransactionEntity> {
    return this.transactionService.registerTransaction(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ type: TransactionEntity })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('update')
  update(@Body() dto: UpdateTransactionDto): Promise<TransactionEntity> {
    return this.transactionService.updateTransaction(dto);
  }
}
