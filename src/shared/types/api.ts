export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MetaEnvelope {
  success: boolean;
  message: string;
  code: number;
  timestamp: string;
  pagination?: Pagination;
}

export interface BackendResponseEnvelope<T> {
  meta: MetaEnvelope;
  data: T;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
}
