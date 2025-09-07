export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface BaseFilters {
  search?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ProductFilters extends BaseFilters {
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
}

export interface OrderFilters extends BaseFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  startItem: number;
  endItem: number;
}
