import { Prisma } from '@prisma/client';

export const CATEGORY_LIST_INCLUDE = {
  translations: true,
  parent: {
    include: { translations: true },
  },
  children: {
    include: { translations: true },
  },
  _count: {
    select: {
      products: true,
      children: true,
    },
  },
} as const;

export const CATEGORY_BASE_INCLUDE = {
  _count: {
    select: {
      products: true,
    },
  },
} as const;

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: typeof CATEGORY_LIST_INCLUDE;
}>;

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: typeof CATEGORY_BASE_INCLUDE;
}>;

export type CategoryListResponse = {
  data: CategoryWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FindAllCategoriesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
};
