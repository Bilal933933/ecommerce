export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  path?: string;
  requestId?: string;
  duration?: number;
  version?: string;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginatedResponse<T>
  extends ApiResponse<PaginatedData<T>> {}

export interface ErrorResponse extends ApiResponse<null> {
  error: {
    code: string;
    details?: unknown;
  };
}

export interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

// interface RefreshableRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }