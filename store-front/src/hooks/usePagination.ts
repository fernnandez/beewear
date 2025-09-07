import { useState, useCallback, useMemo } from 'react';
import { PaginationParams, PaginationState, BaseFilters } from '../types/pagination';

interface UsePaginationOptions<T extends BaseFilters> {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: T;
}

export function usePagination<T extends BaseFilters>({
  initialPage = 1,
  initialLimit = 5,
  initialFilters = {} as T,
}: UsePaginationOptions<T> = {}) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
  });

  const [filters, setFilters] = useState<T>(initialFilters);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  });

  const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
    // Sincronizar o estado de exibição quando a página muda
    if (newPagination.page !== undefined) {
      setPaginationState(prev => ({ ...prev, page: newPagination.page! }));
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset para primeira página quando filtros mudam
    setPagination(prev => ({ ...prev, page: 1 }));
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateSearchOnly = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    // Não resetar página para busca
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= paginationState.totalPages) {
      setPagination(prev => ({ ...prev, page }));
      setPaginationState(prev => ({ ...prev, page }));
    }
  }, [paginationState.totalPages]);

  const nextPage = useCallback(() => {
    if (paginationState.hasNext) {
      goToPage(paginationState.page + 1);
    }
  }, [paginationState.hasNext, paginationState.page, goToPage]);

  const previousPage = useCallback(() => {
    if (paginationState.hasPrevious) {
      goToPage(paginationState.page - 1);
    }
  }, [paginationState.hasPrevious, paginationState.page, goToPage]);

  const updatePaginationState = useCallback((state: Partial<PaginationState>) => {
    setPaginationState(prev => ({ ...prev, ...state }));
  }, []);

  const paginationInfo = useMemo(() => ({
    currentPage: paginationState.page,
    totalPages: paginationState.totalPages,
    totalItems: paginationState.total,
    itemsPerPage: paginationState.limit,
    hasPrevious: paginationState.hasPrevious,
    hasNext: paginationState.hasNext,
    startItem: (paginationState.page - 1) * paginationState.limit + 1,
    endItem: Math.min(paginationState.page * paginationState.limit, paginationState.total),
  }), [paginationState]);

  return {
    pagination,
    filters,
    paginationState,
    updatePagination,
    updateFilters,
    updateSearchOnly,
    resetFilters,
    goToPage,
    nextPage,
    previousPage,
    updatePaginationState,
    paginationInfo,
  };
}
