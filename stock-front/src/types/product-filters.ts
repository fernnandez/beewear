export interface ProductFilters {
  search?: string;
  collectionId?: string;
  active?: boolean;
}

export interface ProductSortOptions {
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'price';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProductQueryParams extends ProductFilters, ProductSortOptions {
  page?: number;
  limit?: number;
}
