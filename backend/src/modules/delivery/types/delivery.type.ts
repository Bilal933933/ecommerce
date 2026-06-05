import {
  Prisma,
  DeliveryType,
  DeliveryStatus,
  OrderStatus,
} from '@prisma/client';

export const DELIVERY_DETAIL_INCLUDE = {
  order: {
    select: { id: true, orderNumber: true, status: true, userId: true },
  },
  driver: {
    select: { id: true, name: true, email: true },
  },
} as const;

export type DeliveryDetail = Prisma.DeliveryGetPayload<{
  include: typeof DELIVERY_DETAIL_INCLUDE;
}>;

export type DeliveryDetailResponse = {
  id: string;
  orderId: string;
  type: DeliveryType;
  status: DeliveryStatus;
  driverId: string | null;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedAt: string | null;
  deliveredAt: string | null;
  proofImageUrl: string | null;
  recipientName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    userId: string;
  } | null;
  driver: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

export type DeliveryListResponse = {
  data: DeliveryDetailResponse[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};
