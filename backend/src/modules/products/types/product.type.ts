import { Prisma } from '@prisma/client';

export const PRODUCT_LIST_INCLUDE = {
  translations: true,
  category: {
    include: { translations: true },
  },
  images: {
    orderBy: { order: 'asc' as const },
    include: { file: true },
  },
  variants: {
    where: { isDeleted: false },
    include: {
      variantValues: {
        include: {
          value: {
            include: { translations: true },
          },
        },
      },
      images: {
        include: { file: true },
      },
    },
  },
  attributes: {
    include: {
      translations: true,
      values: {
        include: { translations: true },
        orderBy: { order: 'asc' as const },
      },
    },
    orderBy: { order: 'asc' as const },
  },
  _count: {
    select: { orderItems: true },
  },
} as const;

export const PRODUCT_BASE_INCLUDE = {
  translations: true,
  _count: {
    select: { orderItems: true },
  },
} as const;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_LIST_INCLUDE;
}>;

export type ProductImageWithFile = Prisma.ProductImageGetPayload<{
  include: { file: true };
}>;

export type ProductListResponse = {
  data: ProductWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FilterProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  categoryId?: string;
};
