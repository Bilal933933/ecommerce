// src/common/interfaces/api-response.interface.ts

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiSuccessPaginated<T> {
  success: true;
  data: T[];
  message: string;
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  details?: string[];
  path: string;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiSuccessPaginated<T> | ApiError;
