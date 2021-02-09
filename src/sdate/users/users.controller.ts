import { Body, Controller, Put, Get, Request, UseGuards, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './enums';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserDto } from './dtos/user.dto';

import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { LimitCountDto } from './dtos/limitCount.dto';

@ApiTags('User')
@Controller('sdate/user')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change role of the user. Only admin users can hava access to this api' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('change-role')
  async changeRole(@Body() dto: ChangeRoleDto): Promise<UserDto> {
    let user = await this.userService.findById(dto.id);
    user.role = dto.role;
    user = await this.userService.updateUser(user);
    return user.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin, UserRole.User, UserRole.Moderator, UserRole.Customer])
  @Get('getAll')
  async getAllUsers(@Request() req): Promise<UserEntity[]> {
    return await this.userService.find();
  }

  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiImplicitParam({ name: 'userId', required: true })
  @ApiOkResponse({ type: UserEntity })
  async getUserById(@Request() req, @Param('userId') userId: string): Promise<UserEntity> {
    return await this.userService.findById(userId);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Random Users by limit_count' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('getRandomUserByLimit')
  async getRandomUserByLimit(@Request() req, @Body() body: LimitCountDto): Promise<UserEntity[]> {
    return await this.userService.findRandomUser(body.limit_count, req.user.id);
  }
}
