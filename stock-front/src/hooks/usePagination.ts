import { useState, useCallback } from 'react';
import type { UsePaginationOptions, UsePaginationReturn, PaginationState } from '../types/pagination';

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset to page 1 when changing limit
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updatePagination = useCallback((total: number, totalPages: number) => {
    setPagination(prev => ({ ...prev, total, totalPages }));
  }, []);

  return {
    pagination,
    setPage,
    setLimit,
    resetPagination,
    updatePagination,
  };
}
