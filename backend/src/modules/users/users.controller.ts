import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type {
  CreateUserData,
  UpdateUserData,
} from './repository/users.repository.interface';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users with pagination
  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.users.list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.usersService.findAll(pageNum, limitNum);
  }

  // ─── بروفايل المستخدم الحالي (شامل) — يجب أن يكون قبل :id ──────────
  @Get('me/profile')
  @ResponseMessage('responses.users.profile')
  async getMyProfile(@CurrentUser('sub') userId: string) {
    return await this.usersService.getMyProfile(userId);
  }

  // تحديث بروفايل المستخدم الحالي
  @Patch('me')
  @ResponseMessage('responses.users.updateMe')
  async updateMe(
    @CurrentUser('sub') userId: string,
    @Body() data: UpdateMeDto,
  ) {
    return await this.usersService.updateMe(userId, data);
  }

  // Get user by ID
  @Get(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.users.detail')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Create new user (Admin only)
  @Post()
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.users.created')
  async create(@Body() userData: CreateUserData) {
    return this.usersService.createUser(userData);
  }

  // Update user
  @Put(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.users.updated')
  async update(@Param('id') id: string, @Body() userData: UpdateUserData) {
    return this.usersService.updateUser(id, userData);
  }

  // Secure delete (soft delete - sets isActive to false)
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.users.deleted')
  async deleteMe(@CurrentUser('sub') userId: string) {
    return this.usersService.deleteUser(userId);
  }

  // Delete user (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.users.deleted')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
