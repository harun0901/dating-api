import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { CategoryDto } from './dtos/category.dto';
import { CategoryState } from './enums';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { RegisterCategoryDto } from './dtos/register-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { UserIdDto } from '../users/dtos/userId.dto';
import { AddUserCategoryDto } from './dtos/add-user-category.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Category')
@Controller('sdate/category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get active category list',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Get('getActiveCategories')
  async getActiveCategories(@Request() req): Promise<CategoryEntity[]> {
    const res = await this.categoryService.findByState(CategoryState.ACCEPTED);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get category by Id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('getCategoryById')
  async getCategoryById(@Body() body: UserIdDto): Promise<CategoryEntity> {
    const res = await this.categoryService.findById(body.id);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add users by Id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('addUsers')
  async addUsers(@Body() body: AddUserCategoryDto): Promise<CategoryEntity> {
    const res = await this.categoryService.findById(body.id);
    res.userList = [];
    for (let index = 0; index < body.userIds.length; index++) {
      const tmpUser = await this.usersService.findById(body.userIds[index]);
      res.userList.push(tmpUser);
    }
    await this.categoryService.updateEntity(res);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a new category',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Post('addCategory')
  async addCategory(
    @Body() body: RegisterCategoryDto,
  ): Promise<CategoryEntity> {
    const beforeItem = await this.categoryService.findByUserName(body.name);
    if (beforeItem.length > 0) {
      return beforeItem[0];
    } else {
      return await this.categoryService.register(body);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update a category',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('updateCategory')
  async updateCategory(@Body() body: UpdateCategoryDto): Promise<CategoryEntity> {
    const res = await this.categoryService.updateCategory(body);
    return res;
  }

  /***********************Moderator System API*************************/
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get active category list for Moderator System',
  })
  @Get('getModeratorActiveCategories')
  async getModeratorActiveCategories(@Request() req): Promise<CategoryEntity[]> {
    const res = await this.categoryService.findByState(CategoryState.ACCEPTED);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get category by Id for Moderator System',
  })
  @Post('getModeratorCategoryById')
  async getModeratorCategoryById(@Body() body: UserIdDto): Promise<CategoryEntity> {
    const res = await this.categoryService.findById(body.id);
    return res;
  }
  /********************************************************************/
}
