import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class VariantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVariant(
    productId: string,
    data: Prisma.ProductVariantCreateWithoutProductInput,
  ) {
    return this.prisma.productVariant.create({
      data: { ...data, product: { connect: { id: productId } } },
      include: {
        variantValues: {
          include: {
            value: { include: { translations: true } },
          },
        },
      },
    });
  }

  async updateVariant(
    id: string,
    data: Prisma.ProductVariantUpdateArgs['data'],
  ) {
    return this.prisma.productVariant.update({
      where: { id },
      data,
      include: {
        variantValues: {
          include: {
            value: { include: { translations: true } },
          },
        },
      },
    });
  }

  async findVariantById(id: string) {
    return this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        variantValues: {
          include: {
            value: { include: { translations: true } },
          },
        },
      },
    });
  }

  async countOrdersForVariant(variantId: string): Promise<number> {
    return this.prisma.orderItem.count({
      where: { variantId },
    });
  }

  async softDeleteVariant(id: string) {
    return this.prisma.productVariant.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async hardDeleteVariant(id: string) {
    return this.prisma.productVariant.delete({ where: { id } });
  }
}
