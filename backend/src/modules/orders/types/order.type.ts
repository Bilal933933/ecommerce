import { Prisma } from '@prisma/client';
import type { OrderStatus } from '@prisma/client';

export const ORDER_DETAIL_INCLUDE = {
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
  statusHistory: {
    include: {
      changedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

export const ORDER_LIST_INCLUDE = {
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      productName: true,
      variantDetails: true,
    },
  },
  _count: { select: { items: true } },
} as const;

export type OrderDetail = Prisma.OrderGetPayload<{
  include: typeof ORDER_DETAIL_INCLUDE;
}>;

export type OrderListItem = Prisma.OrderGetPayload<{
  include: typeof ORDER_LIST_INCLUDE;
}>;

export type OrderListResponse = {
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type OrderDetailResponse = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: Record<string, unknown> | null;
  notes: string | null;
  downloadExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productName: Record<string, string>;
    variantDetails: Record<string, string>;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    fileUrl: string | null;
    downloadCount: number;
    maxDownloads: number;
    product: {
      id: string;
      type: string;
      image: { id: string; url: string } | null;
    };
  }[];
  statusHistory: {
    id: string;
    status: OrderStatus;
    note: string | null;
    changedBy: { id: string; name: string | null };
    createdAt: string;
  }[];
};
