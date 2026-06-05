import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  Delete,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CategoryListResponse,
  CategoryWithRelations,
  CategoryWithCount,
  FindAllCategoriesQuery,
} from './types/category.type';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.categories.created')
  createCategory(@Body() body: CreateCategoryDto): Promise<CategoryWithCount> {
    return this.categoriesService.createCategory(body);
  }

  @Get()
  @Public()
  @ResponseMessage('responses.categories.list')
  findAllCategories(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('parentId') parentId?: string,
  ): Promise<CategoryListResponse> {
    const query: FindAllCategoriesQuery = {
      ...(page ? { page: Math.max(1, parseInt(page, 10) || 1) } : {}),
      ...(limit
        ? { limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 10)) }
        : {}),
      ...(search ? { search } : {}),
      ...(isActive !== undefined ? { isActive: isActive === 'true' } : {}),
      ...(parentId !== undefined ? { parentId: parentId || null } : {}),
    };
    return this.categoriesService.findAllCategories(query);
  }

  @Get('slug/:slug')
  @Public()
  @ResponseMessage('responses.categories.detail')
  findCategoryBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryWithRelations> {
    return this.categoriesService.findCategoryBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('responses.categories.detail')
  findCategoryById(@Param('id') id: string): Promise<CategoryWithRelations> {
    return this.categoriesService.findCategoryById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.categories.updated')
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<CategoryWithRelations> {
    return this.categoriesService.updateCategory(id, body);
  }

  @Patch(':id/image')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.categories.updated')
  attachImageToCategory(
    @Param('id') id: string,
    @Body() body: { fileId: string },
  ): Promise<CategoryWithRelations> {
    return this.categoriesService.attachImageToCategory(id, body.fileId);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.categories.updated')
  deactivateCategory(@Param('id') id: string): Promise<CategoryWithCount> {
    return this.categoriesService.deactivateCategory(id);
  }

  @Patch(':id/reorder')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.categories.updated')
  reorderCategory(
    @Param('id') id: string,
    @Body() body: { order: number },
  ): Promise<CategoryWithCount> {
    return this.categoriesService.reorderCategory(id, body.order);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.categories.deleted')
  deleteCategory(@Param('id') id: string): Promise<CategoryWithCount> {
    return this.categoriesService.deleteCategory(id);
  }
}
