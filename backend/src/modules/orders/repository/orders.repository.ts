import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { OrderStatus } from '@prisma/client';
import { ORDER_PREFIX } from '../orders.constants';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ORDER_DETAIL_INCLUDE, ORDER_LIST_INCLUDE } from '../types/order.type';

const ORDER_CREATE_INCLUDE = {
  ...ORDER_DETAIL_INCLUDE,
  items: {
    include: {
      product: {
        select: {
          id: true,
          type: true,
          images: {
            where: { isMain: true },
            include: { file: { select: { id: true, url: true } } },
            take: 1,
          },
        },
      },
    },
  },
} as const;

type StockItem = { variantId: string; quantity: number };

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    userId: string,
    data: {
      itemsData: Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
      subtotal: Prisma.Decimal;
      shippingCost: Prisma.Decimal;
      total: Prisma.Decimal;
      shippingAddress?: Prisma.JsonObject;
      downloadExpiresAt?: Date;
    },
    physicalItems: StockItem[],
    cartId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear().toString();
      const prefix = `${ORDER_PREFIX}-${year}-`;
      const result = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "Order"
        WHERE "orderNumber" LIKE ${`${prefix}%`}
        FOR UPDATE
      `;
      const orderNumber = `${prefix}${String(Number(result[0].count) + 1).padStart(5, '0')}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal: data.subtotal,
          shippingCost: data.shippingCost,
          total: data.total,
          ...(data.shippingAddress
            ? { shippingAddress: data.shippingAddress }
            : {}),
          ...(data.downloadExpiresAt
            ? { downloadExpiresAt: data.downloadExpiresAt }
            : {}),
          items: { create: data.itemsData },
          statusHistory: {
            create: {
              status: 'PENDING',
              changedById: userId,
            },
          },
        },
        include: ORDER_CREATE_INCLUDE,
      });

      if (physicalItems.length > 0) {
        await Promise.all(
          physicalItems.map((item) =>
            tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            }),
          ),
        );
      }

      await tx.cartItem.deleteMany({ where: { cartId } });

      return order;
    });
  }

  async findOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: ORDER_DETAIL_INCLUDE,
    });
  }

  async findMyOrders(
    userId: string,
    filter: { page: number; limit: number; status?: OrderStatus },
  ) {
    const { page, limit, status } = filter;
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status ? { status } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: ORDER_LIST_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total };
  }

  async findAllOrders(filter: {
    page: number;
    limit: number;
    status?: OrderStatus;
    orderNumber?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page, limit, status, orderNumber, userId, dateFrom, dateTo } =
      filter;
    const where: Prisma.OrderWhereInput = {
      ...(status ? { status } : {}),
      ...(orderNumber
        ? { orderNumber: { contains: orderNumber, mode: 'insensitive' } }
        : {}),
      ...(userId ? { userId } : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          ...ORDER_LIST_INCLUDE,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total };
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    changedById: string,
    note?: string,
    physicalItems?: StockItem[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: id, status, note, changedById },
      });

      if (status === 'CANCELLED' && physicalItems && physicalItems.length > 0) {
        await Promise.all(
          physicalItems.map((item) =>
            tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            }),
          ),
        );
      }

      return order;
    });
  }

  async findVariantWithAttributes(variantId: string) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        variantValues: {
          include: {
            value: {
              include: {
                translations: true,
                attribute: {
                  include: { translations: true },
                },
              },
            },
          },
        },
      },
    });
  }
}
