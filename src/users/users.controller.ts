import { BadRequestException, Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './enums';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserFactDto } from './dtos/userFact.dto';
import { UserBasicDto } from './dtos/userBasic.dto';
import { UserInfoDto } from './dtos/userInfo.dto';
import { UserIdDto } from './dtos/userId.dto';
import { UserSearchDto } from './dtos/userSearch.dto';
import { userRandomDto } from './dtos/userRandom.dto';
import { SocketService } from '../socket/socket.service';
import { UserAnalyseInfoDto } from './dtos/userAnalyseInfo.dto';

@ApiTags('User')
@Controller('sdate/user')
export class UsersController {
  constructor(
    private socketService: SocketService,
    private userService: UsersService,
  ) {}

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
  @ApiOperation({ summary: 'Update the user avatar' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateAvatar')
  async updateAvatar(@Request() req, @Body() dto: UserIdDto): Promise<UserDto> {
    let owner = await this.userService.findById(req.user.id);
    owner.avatar = dto.id;
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get online users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Get('getOnlineUserIds')
  async getOnlineUserIds(@Request() req): Promise<string[]> {
    return this.socketService.onlineUsers;
  }

  /******************* Moderator Controller ************************/

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get online users for Moderator System' })
  @Get('getOnlineUsers')
  async getOnlineUsers(@Request() req): Promise<UserEntity[]> {
    const idList = this.socketService.onlineUsers;
    if (idList === null || idList.length === 0) {
      return [];
    } else {
      return await this.userService.findUsersByIds(idList);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get online users for Moderator System' })
  @Get('getOfflineUsers')
  async getOfflineUsers(@Request() req): Promise<UserEntity[]> {
    const customerUsers = await this.userService.findByRole(UserRole.Customer);
    const onlineUserIds = this.socketService.onlineUsers;
    const res = customerUsers.filter((item) => {
      if (onlineUserIds.includes(item.id)) {
        return false;
      } else {
        return true;
      }
    });
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get online users for Moderator System' })
  @Get('getFakeUsers')
  async getFakeUsers(@Request() req): Promise<UserEntity[]> {
    return this.userService.findByRole(UserRole.Moderator);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customers for Moderator System' })
  @Get('getCustomers')
  async getCustomers(@Request() req): Promise<UserEntity[]> {
    return this.userService.findByRole(UserRole.Customer);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users info for Moderator System' })
  @Post('getUserInfo')
  async getUserInfo(
    @Request() req,
    @Body() dto: UserIdDto,
  ): Promise<UserEntity> {
    return this.userService.findById(dto.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get new users for Moderator System' })
  @Get('getNewCustomers')
  async getNewCustomers(@Request() req): Promise<UserEntity[]> {
    return this.userService.findNewUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get msg count & balance for Moderator System' })
  @Post('getAnalyseInfo')
  async getAnalyseInfo(
    @Request() req,
    @Body() payload: UserIdDto,
  ): Promise<UserAnalyseInfoDto> {
    const customerInfo = await this.userService.getAnalyseInfo(payload.id);
    const msg_count = customerInfo.sentChats.length;
    const balance = customerInfo.balance;
    return { msgCount: msg_count, balance: balance };
  }

  /******************* Moderator Controller ************************/

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
    @Body() body: userRandomDto,
  ): Promise<UserEntity[]> {
    const owner = await this.userService.findLikeRelationById(req.user.id);
    let likeIdList = [];
    let favIdList = [];
    if (typeof owner.likedList !== 'undefined' && owner.likedList.length > 0) {
      likeIdList = owner.likedList.map((user) => user.id);
    }
    if (
      typeof owner.favoriteList !== 'undefined' &&
      owner.favoriteList.length > 0
    ) {
      favIdList = owner.favoriteList.map((user) => user.id);
    }
    const totalList = likeIdList.concat(favIdList);
    totalList.push(req.user.id);
    return await this.userService.findRandomUser(
      body.limit_count,
      totalList,
      body.searchKey,
    );
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
  @Post('getLikedUser')
  async getLikedUser(
    @Request() req,
    @Body() dto: UserSearchDto,
  ): Promise<UserEntity[]> {
    const owner = await this.userService.findLikeRelationById(req.user.id);
    let idList = [];
    if (dto.ignoreFlag) {
      idList = owner.likedList.map((user) => user.id);
    } else {
      const curDate = new Date();
      const endYear = curDate.getFullYear() - dto.startAge;
      const startYear = curDate.getFullYear() - dto.endAge;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear, 11, 31);
      idList = owner.likedList
        .filter((item) => {
          if (
            item.gender == dto.lookingFor &&
            item.location.includes(dto.location) &&
            item.birthday >= startDate &&
            item.birthday <= endDate
          ) {
            return true;
          } else {
            return false;
          }
        })
        .map((user) => user.id);
    }
    if (idList.length === 0) {
      return [];
    }
    return await this.userService.findUsersByIds(idList);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Favorite Users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('getFavoriteUser')
  async getFavoriteUser(
    @Request() req,
    @Body() dto: UserSearchDto,
  ): Promise<UserEntity[]> {
    const owner = await this.userService.findFavoriteRelationById(req.user.id);
    let idList = [];
    if (dto.ignoreFlag) {
      idList = owner.favoriteList.map((user) => user.id);
    } else {
      const curDate = new Date();
      const endYear = curDate.getFullYear() - dto.startAge;
      const startYear = curDate.getFullYear() - dto.endAge;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear, 11, 31);
      idList = owner.favoriteList
        .filter((item) => {
          if (
            item.gender == dto.lookingFor &&
            item.location.includes(dto.location) &&
            item.birthday >= startDate &&
            item.birthday <= endDate
          ) {
            return true;
          } else {
            return false;
          }
        })
        .map((user) => user.id);
    }
    if (idList.length === 0) {
      return [];
    }
    return await this.userService.findUsersByIds(idList);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Visit Users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('getVisitUser')
  async getVisitUser(
    @Request() req,
    @Body() dto: UserSearchDto,
  ): Promise<UserEntity[]> {
    let res = await this.userService.findVisitUsers(req.user.id);
    if (!dto.ignoreFlag) {
      const curDate = new Date();
      const endYear = curDate.getFullYear() - dto.startAge;
      const startYear = curDate.getFullYear() - dto.endAge;
      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear, 11, 31);
      res = res.filter((item) => {
        if (
          item.gender == dto.lookingFor &&
          item.location.includes(dto.location) &&
          item.birthday >= startDate &&
          item.birthday <= endDate
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    return res;
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
    @Body() likeInfo: UserIdDto,
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
    @Body() likeInfo: UserIdDto,
  ): Promise<UserDto> {
    const likeUser = await this.userService.findById(likeInfo.id);
    let owner = await this.userService.findLikeRelationById(req.user.id);
    const index = owner.likedList.findIndex((user) => user.id === likeUser.id);
    owner.likedList.splice(index, 1);
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a favorite user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('favoriteUser')
  async favoriteUser(
    @Request() req,
    @Body() favoriteInfo: UserIdDto,
  ): Promise<UserDto> {
    const favoriteUser = await this.userService.findById(favoriteInfo.id);
    let owner = await this.userService.findFavoriteRelationById(req.user.id);
    owner.favoriteList.push(favoriteUser);
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a favorite user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('removeFavoriteUser')
  async removeFavoriteUser(
    @Request() req,
    @Body() favoriteInfo: UserIdDto,
  ): Promise<UserDto> {
    const favoriteUser = await this.userService.findById(favoriteInfo.id);
    let owner = await this.userService.findFavoriteRelationById(req.user.id);
    const index = owner.favoriteList.findIndex(
      (user) => user.id === favoriteUser.id,
    );
    owner.favoriteList.splice(index, 1);
    owner = await this.userService.updateUser(owner);
    return owner.toDto();
  }
}
