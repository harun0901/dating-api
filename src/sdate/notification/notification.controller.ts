import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { NotificationService } from './notification.service';
import { AddNotificationDto } from './dtos/addNotification.dto';
import { UsersService } from '../users/users.service';
import { NotificationDto } from './dtos/notification.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { UserIdDto } from '../users/dtos/userId.dto';
import { UserDto } from '../users/dtos/user.dto';
import { NotificationState, NotificationType } from './enums';
import { NotificationIdDto } from './dtos/notificationId.dto';

@ApiTags('Notification')
@Controller('sdate/notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private userService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new notification' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('addNotification')
  async addNotification(
    @Request() req,
    @Body() body: AddNotificationDto,
  ): Promise<NotificationDto> {
    const owner = await this.userService.findById(req.user.id);
    const receiver = await this.userService.findById(body.receiver_id);

    return await this.notificationService.addNotification(
      body,
      owner,
      receiver,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a notification',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateNotification')
  async updateNotification(
    @Request() req,
    @Body() paraInfo: NotificationIdDto,
  ): Promise<NotificationDto[]> {
    let oneItem = await this.notificationService.findById(paraInfo.id);
    oneItem.seen = NotificationState.Seen;
    oneItem = await this.notificationService.update(oneItem);
    const res = await this.userService.findById(req.user.id);
    return await this.notificationService.findByUser(res);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notification' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Get('getAllNotification')
  async getAllNotification(@Request() req): Promise<NotificationDto[]> {
    const owner = await this.userService.findById(req.user.id);
    return await this.notificationService.findByUser(owner);
  }
}
