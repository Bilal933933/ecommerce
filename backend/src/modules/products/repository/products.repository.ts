import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  ProductWithRelations,
  FilterProductQuery,
  PRODUCT_LIST_INCLUDE,
} from '../types/product.type';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    data: Prisma.ProductCreateArgs['data'],
  ): Promise<ProductWithRelations> {
    return this.prisma.product.create({
      data,
      include: PRODUCT_LIST_INCLUDE,
    });
  }

  async findAllProducts(
    query: FilterProductQuery,
  ): Promise<{ data: ProductWithRelations[]; total: number }> {
    const { page = 1, limit = 10, search, type, status, categoryId } = query;

    const where: Prisma.ProductWhereInput = {
      ...(type ? { type: type as Prisma.EnumProductTypeFilter['equals'] } : {}),
      ...(status
        ? { status: status as Prisma.EnumProductStatusFilter['equals'] }
        : {}),
      ...(categoryId ? { categoryId } : {}),
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
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: PRODUCT_LIST_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async findProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    return this.prisma.product.findUnique({
      where: { slug },
      include: PRODUCT_LIST_INCLUDE,
    });
  }

  async findProductById(id: string): Promise<ProductWithRelations | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_LIST_INCLUDE,
    });
  }

  async updateProduct(
    id: string,
    data: Prisma.ProductUpdateArgs['data'],
  ): Promise<ProductWithRelations> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: PRODUCT_LIST_INCLUDE,
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async exists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return count > 0;
  }
}
