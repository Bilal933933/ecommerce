import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CategoryWithCount,
  CategoryWithRelations,
  FindAllCategoriesQuery,
  CATEGORY_LIST_INCLUDE,
  CATEGORY_BASE_INCLUDE,
} from '../types/category.type';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    data: Prisma.CategoryCreateArgs['data'],
  ): Promise<CategoryWithCount> {
    return this.prisma.category.create({
      data,
      include: CATEGORY_BASE_INCLUDE,
    });
  }

  async findAllCategories(
    query: FindAllCategoriesQuery,
  ): Promise<{ data: CategoryWithRelations[]; total: number }> {
    const { page = 1, limit = 10, search, isActive, parentId } = query;

    const where: Prisma.CategoryWhereInput = {
      ...(isActive !== undefined ? { isActive } : {}),
      ...(parentId !== undefined ? { parentId: parentId ?? null } : {}),
      ...(search
        ? {
            translations: {
              some: {
                name: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: CATEGORY_LIST_INCLUDE,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async findCategoryById(id: string): Promise<CategoryWithRelations | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: CATEGORY_LIST_INCLUDE,
    });
  }

  async findCategoryBySlug(
    slug: string,
  ): Promise<CategoryWithRelations | null> {
    return this.prisma.category.findUnique({
      where: { slug },
      include: CATEGORY_LIST_INCLUDE,
    });
  }

  async updateCategory(
    id: string,
    data: Prisma.CategoryUpdateArgs['data'],
  ): Promise<CategoryWithRelations> {
    return this.prisma.category.update({
      where: { id },
      data,
      include: CATEGORY_LIST_INCLUDE,
    });
  }

  async deactivateCategory(id: string): Promise<CategoryWithCount> {
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
      include: CATEGORY_BASE_INCLUDE,
    });
  }

  async reorderCategory(id: string, order: number): Promise<CategoryWithCount> {
    return this.prisma.category.update({
      where: { id },
      data: { order },
      include: CATEGORY_BASE_INCLUDE,
    });
  }

  async getCategoryWithChildrenAndProductCount(
    id: string,
  ): Promise<{ childrenCount: number; productsCount: number }> {
    const [childrenCount, category] = await Promise.all([
      this.prisma.category.count({ where: { parentId: id } }),
      this.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      }),
    ]);

    return {
      childrenCount,
      productsCount: category?._count.products ?? 0,
    };
  }

  async deleteCategory(id: string): Promise<CategoryWithCount> {
    return this.prisma.category.delete({
      where: { id },
      include: CATEGORY_BASE_INCLUDE,
    });
  }

  async exists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return count > 0;
  }
}
