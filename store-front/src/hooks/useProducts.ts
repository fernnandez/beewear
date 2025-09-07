import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { productService } from "../services/product.service";
import { usePagination } from "./usePagination";
import { ProductFilters } from "../types/pagination";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProduct = (publicId: string) => {
  return useQuery({
    queryKey: ["product", publicId],
    queryFn: () => productService.getProduct(publicId),
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => productService.getCollections(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

export const useProductsPaginated = (options?: {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: ProductFilters;
}) => {
  const {
    pagination,
    filters,
    updatePagination,
    updateFilters,
    updateSearchOnly,
    resetFilters,
    goToPage,
    nextPage,
    previousPage,
    updatePaginationState,
    paginationInfo,
  } = usePagination<ProductFilters>(options);

  const query = useQuery({
    queryKey: ["products-paginated", pagination, filters],
    queryFn: () => productService.getProductsPaginated(pagination, filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Atualizar estado de paginação quando dados chegam
  useEffect(() => {
    if (query.data && !query.isLoading) {
      updatePaginationState({
        total: query.data.total,
        totalPages: query.data.totalPages,
        hasPrevious: query.data.hasPrevious,
        hasNext: query.data.hasNext,
      });
    }
  }, [query.data, query.isLoading, updatePaginationState]);

  return {
    ...query,
    pagination,
    filters,
    updatePagination,
    updateFilters,
    updateSearchOnly,
    resetFilters,
    goToPage,
    nextPage,
    previousPage,
    paginationInfo,
  };
};
