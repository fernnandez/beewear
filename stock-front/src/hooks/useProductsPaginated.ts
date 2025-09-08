import { useQuery } from '@tanstack/react-query';
import { fetchProductsPaginated } from '../services/product.service';
import type { ProductQueryParams } from '../types/product-filters';
import type { PaginatedResponse } from '../types/pagination';
import type { Product } from '../types/product';

export function useProductsPaginated(params: ProductQueryParams = {}) {
  return useQuery<PaginatedResponse<Product>, Error>({
    queryKey: ['products-paginated', params],
    queryFn: () => fetchProductsPaginated(params),
    placeholderData: (previousData) => previousData,
  });
}
