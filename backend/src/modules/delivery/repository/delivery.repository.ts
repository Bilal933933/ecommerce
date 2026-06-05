import { Injectable } from '@nestjs/common';
import { Prisma, DeliveryType, OrderStatus } from '@prisma/client';
import type { DeliveryStatus } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { DELIVERY_DETAIL_INCLUDE } from '../types/delivery.type';

@Injectable()
export class DeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDelivery(data: Prisma.DeliveryCreateArgs['data']) {
    return this.prisma.delivery.create({
      data,
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async findDeliveryById(id: string) {
    return this.prisma.delivery.findUnique({
      where: { id },
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async findDeliveryByOrderId(orderId: string) {
    return this.prisma.delivery.findUnique({
      where: { orderId },
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async findAllDeliveries(filter: {
    page: number;
    limit: number;
    status?: DeliveryStatus;
    type?: DeliveryType;
    driverId?: string;
    orderId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page, limit, status, type, driverId, orderId, dateFrom, dateTo } =
      filter;
    const where: Prisma.DeliveryWhereInput = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(driverId ? { driverId } : {}),
      ...(orderId ? { orderId } : {}),
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
      this.prisma.delivery.findMany({
        where,
        include: DELIVERY_DETAIL_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.delivery.count({ where }),
    ]);

    return { data, total };
  }

  async findMyDeliveries(
    driverId: string,
    filter: {
      page: number;
      limit: number;
      status?: DeliveryStatus;
      dateFrom?: string;
      dateTo?: string;
    },
  ) {
    const { page, limit, status, dateFrom, dateTo } = filter;
    const where: Prisma.DeliveryWhereInput = {
      driverId,
      ...(status ? { status } : {}),
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
      this.prisma.delivery.findMany({
        where,
        include: DELIVERY_DETAIL_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.delivery.count({ where }),
    ]);

    return { data, total };
  }

  async updateDelivery(id: string, data: Prisma.DeliveryUpdateArgs['data']) {
    return this.prisma.delivery.update({
      where: { id },
      data,
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    deliveredAt?: Date,
  ) {
    return this.prisma.delivery.update({
      where: { id },
      data: { status, ...(deliveredAt ? { deliveredAt } : {}) },
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async updateDeliveryAndOrderStatus(
    deliveryId: string,
    deliveryStatus: DeliveryStatus,
    orderId: string,
    orderStatus: OrderStatus,
    deliveredAt?: Date,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const delivery = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          status: deliveryStatus,
          ...(deliveredAt ? { deliveredAt } : {}),
        },
        include: DELIVERY_DETAIL_INCLUDE,
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: orderStatus },
      });

      return delivery;
    });
  }

  async updateProofImage(
    id: string,
    proofImageUrl: string,
    recipientName?: string,
  ) {
    return this.prisma.delivery.update({
      where: { id },
      data: { proofImageUrl, ...(recipientName ? { recipientName } : {}) },
      include: DELIVERY_DETAIL_INCLUDE,
    });
  }

  async findFileUrl(fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      select: { url: true },
    });
    return file?.url ?? null;
  }

  async findOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });
  }

  async findDriverById(driverId: string) {
    return this.prisma.user.findUnique({
      where: { id: driverId },
      select: { id: true, role: true },
    });
  }
}
