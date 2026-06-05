import { DeliveryStatus, OrderStatus } from '@prisma/client';

export const DRIVER_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.PENDING]: [],
  [DeliveryStatus.ASSIGNED]: [DeliveryStatus.PICKED_UP],
  [DeliveryStatus.PICKED_UP]: [DeliveryStatus.OUT_FOR_DELIVERY],
  [DeliveryStatus.OUT_FOR_DELIVERY]: [
    DeliveryStatus.DELIVERED,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.DELIVERED]: [],
  [DeliveryStatus.FAILED]: [DeliveryStatus.RETURNED],
  [DeliveryStatus.RETURNED]: [],
};

export const ADMIN_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.PENDING]: [DeliveryStatus.ASSIGNED, DeliveryStatus.FAILED],
  [DeliveryStatus.ASSIGNED]: [DeliveryStatus.PICKED_UP, DeliveryStatus.FAILED],
  [DeliveryStatus.PICKED_UP]: [
    DeliveryStatus.OUT_FOR_DELIVERY,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.OUT_FOR_DELIVERY]: [
    DeliveryStatus.DELIVERED,
    DeliveryStatus.FAILED,
  ],
  [DeliveryStatus.DELIVERED]: [],
  [DeliveryStatus.FAILED]: [DeliveryStatus.ASSIGNED, DeliveryStatus.RETURNED],
  [DeliveryStatus.RETURNED]: [],
};

export const ALLOWED_ORDER_STATUSES_FOR_DELIVERY: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
];
