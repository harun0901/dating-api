import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './enums';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { LimitCountDto } from './dtos/limitCount.dto';
import { UserFactDto } from './dtos/userFact.dto';
import { UserBasicDto } from './dtos/userBasic.dto';
import { UserInfoDto } from './dtos/userInfo.dto';
import { UserLikeDto } from './dtos/userLike.dto';

@ApiTags('User')
@Controller('sdate/user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Change role of the user. Only admin users can hava access to this api',
  })
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
  @ApiOperation({
    summary:
      'Update the user fact info. Only admin users can hava access to change the other user fact info',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateFact/:userId')
  async updateFact(
    @Request() req,
    @Body() dto: UserFactDto,
    @Param('userId') userId: string,
  ): Promise<UserDto> {
    let user = await this.userService.findById(userId);
    if (req.user.role === UserRole.Admin || userId === req.user.id) {
      user.lookingFor = dto.lookingFor;
      user.body = dto.body;
      user.education = dto.education;
      user.interestedIn = dto.interestedIn;
      user.kids = dto.kids;
      user.profession = dto.profession;
      user.relationshipStatus = dto.relationshipStatus;
      user.smoker = dto.smoker;
      user.language = dto.language;
      user.height = dto.height;
      user.alcohol = dto.alcohol;
    } else {
      throw new BadRequestException(
        "Your role couldn't change the user fact info.",
      );
    }
    user = await this.userService.updateUser(user);
    return user.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Get('getAll')
  async getAllUsers(@Request() req): Promise<UserEntity[]> {
    return await this.userService.find();
  }

  @Get('getById/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiImplicitParam({ name: 'userId', required: true })
  @ApiOkResponse({ type: UserEntity })
  async getUserById(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserEntity> {
    return await this.userService.findById(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Random Users by limit_count' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('getRandomUserByLimit')
  async getRandomUserByLimit(
    @Request() req,
    @Body() body: LimitCountDto,
  ): Promise<UserEntity[]> {
    const owner = await this.userService.findLikeRelationById(req.user.id);
    const idList = owner.likedList.map((user) => user.id);
    idList.push(req.user.id);
    return await this.userService.findRandomUser(body.limit_count, idList);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Liked Users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Get('getLikedUser')
  async getLikedUser(@Request() req): Promise<UserEntity[]> {
    const owner = await this.userService.findLikeRelationById(req.user.id);
    const idList = owner.likedList.map((user) => user.id);
    return await this.userService.findLikedUser(idList);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update the user basic info. Only admin users can hava access to change the other user basic info',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateBasic/:userId')
  async updateBasic(
    @Request() req,
    @Body() dto: UserBasicDto,
    @Param('userId') userId: string,
  ): Promise<UserDto> {
    let user = await this.userService.findById(userId);
    if (req.user.role === UserRole.Admin || userId === req.user.id) {
      user.fullName = dto.fullName;
      user.location = dto.location;
      user.about = dto.about;
    } else {
      throw new BadRequestException(
        "Your role couldn't change the user basic info.",
      );
    }
    user = await this.userService.updateUser(user);
    return user.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update the user info. Only admin users can hava access to change the other user basic info',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateInfo/:userId')
  async updateInfo(
    @Request() req,
    @Body() dto: UserInfoDto,
    @Param('userId') userId: string,
  ): Promise<UserDto> {
    let user = await this.userService.findById(userId);
    if (req.user.role === UserRole.Admin || userId === req.user.id) {
      user.birthday = dto.birthday;
      user.email = dto.email;
    } else {
      throw new BadRequestException(
        "Your role couldn't change the user basic info.",
      );
    }
    user = await this.userService.updateUser(user);
    return user.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a like user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('likeUser')
  async likeUser(
    @Request() req,
    @Body() likeInfo: UserLikeDto,
  ): Promise<UserDto> {
    const likeUser = await this.userService.findById(likeInfo.id);
    let owner = await this.userService.findLikeRelationById(req.user.id);
    owner.likedList.push(likeUser);
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a like user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('removeLikeUser')
  async removeLikeUser(
    @Request() req,
    @Body() likeInfo: UserLikeDto,
  ): Promise<UserDto> {
    const likeUser = await this.userService.findById(likeInfo.id);
    let owner = await this.userService.findLikeRelationById(req.user.id);
    const index = owner.likedList.findIndex((user) => user.id === likeUser.id);
    owner.likedList.splice(index, 1);
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
  }
}
