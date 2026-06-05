import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const CART_WITH_ITEMS_INCLUDE = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              translations: true,
              images: {
                where: { isMain: true },
                include: { file: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  },
} as const;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async findCartWithItems(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: CART_WITH_ITEMS_INCLUDE,
    });
  }

  async findCartItem(cartId: string, variantId: string) {
    return this.prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } },
    });
  }

  async addItem(
    cartId: string,
    variantId: string,
    productId: string,
    quantity: number,
    priceAtAdd: Prisma.Decimal,
  ) {
    return this.prisma.cartItem.create({
      data: { cartId, variantId, productId, quantity, priceAtAdd },
    });
  }

  async updateItemQuantity(id: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  async removeItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async findVariant(variantId: string) {
    return this.prisma.productVariant.findFirst({
      where: { id: variantId, isDeleted: false },
      include: {
        product: {
          select: { id: true, type: true },
        },
      },
    });
  }
}
