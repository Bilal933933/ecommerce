import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { DeliveryType, DeliveryStatus, OrderStatus } from '@prisma/client';
import { DeliveryRepository } from './repository/delivery.repository';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { FilterAdminDeliveriesDto } from './dto/filter-admin-deliveries.dto';
import { FilterMyDeliveriesDto } from './dto/filter-my-deliveries.dto';
import {
  DRIVER_TRANSITIONS,
  ADMIN_TRANSITIONS,
  ALLOWED_ORDER_STATUSES_FOR_DELIVERY,
} from './delivery.constants';
import type {
  DeliveryDetail,
  DeliveryDetailResponse,
  DeliveryListResponse,
} from './types/delivery.type';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly deliveryRepo: DeliveryRepository,
    private readonly i18n: I18nService,
  ) {}

  async createDelivery(
    dto: CreateDeliveryDto,
  ): Promise<DeliveryDetailResponse> {
    const order = await this.deliveryRepo.findOrderById(dto.orderId);
    if (!order) {
      throw new NotFoundException(
        this.i18n.t('errors.delivery.order_not_found'),
      );
    }

    if (!ALLOWED_ORDER_STATUSES_FOR_DELIVERY.includes(order.status)) {
      throw new BadRequestException(
        this.i18n.t('errors.delivery.invalid_order_status'),
      );
    }

    const existing = await this.deliveryRepo.findDeliveryByOrderId(dto.orderId);
    if (existing) {
      throw new ConflictException(
        this.i18n.t('errors.delivery.already_exists'),
      );
    }

    if (dto.type === DeliveryType.INTERNAL) {
      if (!dto.driverId) {
        throw new BadRequestException(
          this.i18n.t('errors.delivery.driver_required'),
        );
      }
      const driver = await this.deliveryRepo.findDriverById(dto.driverId);
      if (!driver) {
        throw new NotFoundException(
          this.i18n.t('errors.delivery.driver_not_found'),
        );
      }
      if (driver.role !== 'DELIVERY') {
        throw new BadRequestException(
          this.i18n.t('errors.delivery.driver_invalid_role'),
        );
      }
    } else {
      if (!dto.courierName) {
        throw new BadRequestException(
          this.i18n.t('errors.delivery.courier_required'),
        );
      }
    }

    const initialStatus =
      dto.type === DeliveryType.INTERNAL && dto.driverId
        ? DeliveryStatus.ASSIGNED
        : DeliveryStatus.PENDING;

    const delivery = await this.deliveryRepo.createDelivery({
      orderId: dto.orderId,
      type: dto.type,
      status: initialStatus,
      driverId: dto.driverId ?? null,
      courierName: dto.courierName ?? null,
      trackingNumber: dto.trackingNumber ?? null,
      trackingUrl: dto.trackingUrl ?? null,
      estimatedAt: dto.estimatedAt ? new Date(dto.estimatedAt) : null,
      notes: dto.notes ?? null,
    });

    return this.toResponse(delivery);
  }

  async getAllDeliveries(
    filter: FilterAdminDeliveriesDto,
  ): Promise<DeliveryListResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      driverId,
      orderId,
      dateFrom,
      dateTo,
    } = filter;
    const { data, total } = await this.deliveryRepo.findAllDeliveries({
      page,
      limit,
      status,
      type,
      driverId,
      orderId,
      dateFrom,
      dateTo,
    });

    return {
      data: data.map((d) => this.toResponse(d)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDeliveryById(id: string): Promise<DeliveryDetailResponse> {
    const delivery = await this.deliveryRepo.findDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException(this.i18n.t('errors.delivery.not_found'));
    }
    return this.toResponse(delivery);
  }

  async updateDelivery(
    id: string,
    dto: UpdateDeliveryDto,
  ): Promise<DeliveryDetailResponse> {
    const delivery = await this.deliveryRepo.findDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException(this.i18n.t('errors.delivery.not_found'));
    }

    if (dto.driverId !== undefined) {
      const driver = await this.deliveryRepo.findDriverById(dto.driverId);
      if (!driver) {
        throw new NotFoundException(
          this.i18n.t('errors.delivery.driver_not_found'),
        );
      }
      if (driver.role !== 'DELIVERY') {
        throw new BadRequestException(
          this.i18n.t('errors.delivery.driver_invalid_role'),
        );
      }
    }

    const updated = await this.deliveryRepo.updateDelivery(id, {
      ...(dto.driverId !== undefined ? { driverId: dto.driverId } : {}),
      ...(dto.courierName !== undefined
        ? { courierName: dto.courierName }
        : {}),
      ...(dto.trackingNumber !== undefined
        ? { trackingNumber: dto.trackingNumber }
        : {}),
      ...(dto.trackingUrl !== undefined
        ? { trackingUrl: dto.trackingUrl }
        : {}),
      ...(dto.estimatedAt !== undefined
        ? { estimatedAt: new Date(dto.estimatedAt) }
        : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    });

    return this.toResponse(updated);
  }

  async updateDeliveryStatus(
    id: string,
    dto: UpdateDeliveryStatusDto,
  ): Promise<DeliveryDetailResponse> {
    const delivery = await this.deliveryRepo.findDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException(this.i18n.t('errors.delivery.not_found'));
    }

    const allowed = ADMIN_TRANSITIONS[delivery.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        this.i18n.t('errors.delivery.invalid_status_transition', {
          args: { from: delivery.status, to: dto.status },
        }),
      );
    }

    if (dto.status === DeliveryStatus.DELIVERED) {
      await this.deliveryRepo.updateDeliveryAndOrderStatus(
        id,
        dto.status,
        delivery.orderId,
        OrderStatus.DELIVERED,
        new Date(),
      );
    } else {
      await this.deliveryRepo.updateDeliveryStatus(id, dto.status);
    }

    const updated = await this.deliveryRepo.findDeliveryById(id);
    return this.toResponse(updated!);
  }

  async getMyDeliveries(
    driverId: string,
    filter: FilterMyDeliveriesDto,
  ): Promise<DeliveryListResponse> {
    const { page = 1, limit = 10, status, dateFrom, dateTo } = filter;
    const { data, total } = await this.deliveryRepo.findMyDeliveries(driverId, {
      page,
      limit,
      status,
      dateFrom,
      dateTo,
    });

    return {
      data: data.map((d) => this.toResponse(d)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateMyDeliveryStatus(
    deliveryId: string,
    dto: UpdateDeliveryStatusDto,
    driverId: string,
  ): Promise<DeliveryDetailResponse> {
    const delivery = await this.deliveryRepo.findDeliveryById(deliveryId);
    if (!delivery) {
      throw new NotFoundException(this.i18n.t('errors.delivery.not_found'));
    }

    if (delivery.driverId !== driverId) {
      throw new ForbiddenException(
        this.i18n.t('errors.delivery.not_assigned_to_you'),
      );
    }

    const allowed = DRIVER_TRANSITIONS[delivery.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        this.i18n.t('errors.delivery.invalid_status_transition', {
          args: { from: delivery.status, to: dto.status },
        }),
      );
    }

    if (dto.status === DeliveryStatus.DELIVERED) {
      await this.deliveryRepo.updateDeliveryAndOrderStatus(
        deliveryId,
        dto.status,
        delivery.orderId,
        OrderStatus.DELIVERED,
        new Date(),
      );
    } else {
      await this.deliveryRepo.updateDeliveryStatus(deliveryId, dto.status);
    }

    const updated = await this.deliveryRepo.findDeliveryById(deliveryId);
    return this.toResponse(updated!);
  }

  async updateProofImage(
    deliveryId: string,
    fileId: string,
    recipientName: string | undefined,
    driverId: string,
  ): Promise<DeliveryDetailResponse> {
    const delivery = await this.deliveryRepo.findDeliveryById(deliveryId);
    if (!delivery) {
      throw new NotFoundException(this.i18n.t('errors.delivery.not_found'));
    }

    if (delivery.driverId !== driverId) {
      throw new ForbiddenException(
        this.i18n.t('errors.delivery.not_assigned_to_you'),
      );
    }

    if (
      delivery.status !== DeliveryStatus.OUT_FOR_DELIVERY &&
      delivery.status !== DeliveryStatus.DELIVERED
    ) {
      throw new BadRequestException(
        this.i18n.t('errors.delivery.proof_invalid_status'),
      );
    }

    const fileUrl = await this.deliveryRepo.findFileUrl(fileId);
    if (!fileUrl) {
      throw new NotFoundException(this.i18n.t('errors.file.not_found'));
    }

    const updated = await this.deliveryRepo.updateProofImage(
      deliveryId,
      fileUrl,
      recipientName,
    );

    return this.toResponse(updated);
  }

  private toResponse(delivery: DeliveryDetail): DeliveryDetailResponse {
    return {
      id: delivery.id,
      orderId: delivery.orderId,
      type: delivery.type,
      status: delivery.status,
      driverId: delivery.driverId,
      courierName: delivery.courierName,
      trackingNumber: delivery.trackingNumber,
      trackingUrl: delivery.trackingUrl,
      estimatedAt: delivery.estimatedAt?.toISOString() ?? null,
      deliveredAt: delivery.deliveredAt?.toISOString() ?? null,
      proofImageUrl: delivery.proofImageUrl,
      recipientName: delivery.recipientName,
      notes: delivery.notes,
      createdAt: delivery.createdAt.toISOString(),
      updatedAt: delivery.updatedAt.toISOString(),
      order: delivery.order
        ? {
            id: delivery.order.id,
            orderNumber: delivery.order.orderNumber,
            status: delivery.order.status,
            userId: delivery.order.userId,
          }
        : null,
      driver: delivery.driver
        ? {
            id: delivery.driver.id,
            name: delivery.driver.name,
            email: delivery.driver.email,
          }
        : null,
    };
  }
}
