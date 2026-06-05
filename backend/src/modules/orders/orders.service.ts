import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Prisma, OrderStatus } from '@prisma/client';
import { OrdersRepository } from './repository/orders.repository';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FilterMyOrdersDto } from './dto/filter-my-orders.dto';
import { FilterAdminOrdersDto } from './dto/filter-admin-orders.dto';
import { VALID_TRANSITIONS, DOWNLOAD_EXPIRY_DAYS } from './orders.constants';
import type {
  OrderDetail,
  OrderDetailResponse,
  OrderListResponse,
} from './types/order.type';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly cartService: CartService,
    private readonly i18n: I18nService,
  ) {}

  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<OrderDetailResponse> {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException(this.i18n.t('errors.orders.empty_cart'));
    }

    const hasPhysical = cart.items.some(
      (i) => i.variant.product.type === 'PHYSICAL',
    );
    if (hasPhysical && !dto.shippingAddress) {
      throw new BadRequestException(
        this.i18n.t('errors.orders.shipping_address_required'),
      );
    }

    type SnapshotItem = {
      variantId: string;
      productId: string;
      productName: Prisma.JsonObject;
      variantDetails: Prisma.JsonObject;
      quantity: number;
      unitPrice: Prisma.Decimal;
      totalPrice: Prisma.Decimal;
    };

    const itemsData: SnapshotItem[] = [];
    const physicalItems: { variantId: string; quantity: number }[] = [];
    const allDigital =
      cart.items.length > 0 &&
      cart.items.every((i) => i.variant.product.type === 'DIGITAL');

    for (const item of cart.items) {
      const variant = await this.ordersRepo.findVariantWithAttributes(
        item.variantId,
      );

      if (!variant || variant.isDeleted) {
        throw new NotFoundException(
          this.i18n.t('errors.orders.variant_unavailable', {
            args: { sku: item.variant.sku ?? item.variantId },
          }),
        );
      }

      if (
        item.variant.product.type === 'PHYSICAL' &&
        variant.stock < item.quantity
      ) {
        throw new ConflictException(
          this.i18n.t('errors.orders.insufficient_stock', {
            args: {
              sku: item.variant.sku ?? item.variantId,
              available: variant.stock,
              requested: item.quantity,
            },
          }),
        );
      }

      if (item.variant.product.type === 'PHYSICAL') {
        physicalItems.push({
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }

      const productName: Record<string, string> = {};
      for (const t of item.variant.product.translations) {
        productName[t.locale] = t.name;
      }

      const variantDetails: Record<string, string> = {};
      if (variant.variantValues) {
        for (const vv of variant.variantValues) {
          const attrName = vv.value.attribute.translations[0]?.name ?? '';
          const valName = vv.value.translations[0]?.name ?? '';
          if (attrName && valName) {
            variantDetails[attrName] = valName;
          }
        }
      }

      itemsData.push({
        variantId: item.variantId,
        productId: item.productId,
        productName: productName,
        variantDetails: variantDetails,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.currentPrice),
        totalPrice: new Prisma.Decimal(item.currentPrice * item.quantity),
      });
    }

    const subtotal = itemsData.reduce(
      (sum, i) => sum.add(i.totalPrice),
      new Prisma.Decimal(0),
    );

    const now = new Date();
    const downloadExpiresAt = allDigital
      ? new Date(now.getTime() + DOWNLOAD_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      : undefined;

    const order = await this.ordersRepo.createOrder(
      userId,
      {
        itemsData: itemsData.map((i) => ({
          variantId: i.variantId,
          productId: i.productId,
          productName: i.productName,
          variantDetails: i.variantDetails,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        subtotal,
        shippingCost: new Prisma.Decimal(0),
        total: subtotal,
        ...(dto.shippingAddress
          ? { shippingAddress: dto.shippingAddress as Prisma.JsonObject }
          : {}),
        ...(downloadExpiresAt ? { downloadExpiresAt } : {}),
      },
      physicalItems,
      cart.id,
    );

    return this.toOrderDetailResponse(order);
  }

  async getMyOrders(
    userId: string,
    filter: FilterMyOrdersDto,
  ): Promise<OrderListResponse> {
    const { page = 1, limit = 10, status } = filter;
    const { data, total } = await this.ordersRepo.findMyOrders(userId, {
      page,
      limit,
      status,
    });

    return {
      data: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderDetail(
    id: string,
    userId: string,
  ): Promise<OrderDetailResponse> {
    const order = await this.ordersRepo.findOrderById(id);
    if (!order) {
      throw new NotFoundException(this.i18n.t('errors.orders.not_found'));
    }
    if (order.userId !== userId) {
      throw new NotFoundException(this.i18n.t('errors.orders.not_found'));
    }

    return this.toOrderDetailResponse(order);
  }

  async getAllOrders(filter: FilterAdminOrdersDto): Promise<OrderListResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      orderNumber,
      userId,
      dateFrom,
      dateTo,
    } = filter;
    const { data, total } = await this.ordersRepo.findAllOrders({
      page,
      limit,
      status,
      orderNumber,
      userId,
      dateFrom,
      dateTo,
    });

    return {
      data: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    adminId: string,
  ): Promise<OrderDetailResponse> {
    const order = await this.ordersRepo.findOrderById(id);
    if (!order) {
      throw new NotFoundException(this.i18n.t('errors.orders.not_found'));
    }

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        this.i18n.t('errors.orders.invalid_status_transition', {
          args: { from: order.status, to: dto.status },
        }),
      );
    }

    const physicalItems =
      dto.status === OrderStatus.CANCELLED
        ? order.items
            .filter((item) => item.product?.type === 'PHYSICAL')
            .map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            }))
        : undefined;

    await this.ordersRepo.updateOrderStatus(
      id,
      dto.status,
      adminId,
      dto.note,
      physicalItems,
    );

    const updated = await this.ordersRepo.findOrderById(id);
    if (!updated) {
      throw new NotFoundException(this.i18n.t('errors.orders.not_found'));
    }
    return this.toOrderDetailResponse(updated);
  }

  private toOrderDetailResponse(order: OrderDetail): OrderDetailResponse {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      shippingAddress: order.shippingAddress as Record<string, unknown> | null,
      notes: order.notes ?? null,
      downloadExpiresAt: order.downloadExpiresAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        productName: item.productName as Record<string, string>,
        variantDetails: item.variantDetails as Record<string, string>,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        fileUrl: item.fileUrl ?? null,
        downloadCount: item.downloadCount,
        maxDownloads: item.maxDownloads,
        product: {
          id: item.product?.id ?? item.productId,
          type: item.product?.type ?? '',
          image: item.product?.images?.[0]
            ? {
                id: item.product.images[0].file.id,
                url: item.product.images[0].file.url,
              }
            : null,
        },
      })),
      statusHistory: (order.statusHistory ?? []).map((h) => ({
        id: h.id,
        status: h.status,
        note: h.note ?? null,
        changedBy: { id: h.changedBy.id, name: h.changedBy.name ?? null },
        createdAt: h.createdAt.toISOString(),
      })),
    };
  }
}
