import { Group, Select, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import type { PaginationState } from '../../types/pagination';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [
  { value: '10', label: '10 por página' },
  { value: '20', label: '20 por página' },
  { value: '50', label: '50 por página' },
  { value: '100', label: '100 por página' },
];

export function Pagination({ pagination, onPageChange, onLimitChange }: PaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  const handleLimitChange = (value: string | null) => {
    if (value) {
      onLimitChange(parseInt(value));
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? 'filled' : 'outline'}
          size="sm"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Mostrando {total} resultado{total !== 1 ? 's' : ''}
        </Text>
        <Select
          data={LIMIT_OPTIONS}
          value={limit.toString()}
          onChange={handleLimitChange}
          style={{ minWidth: '150px' }}
        />
      </Group>
    );
  }

  return (
    <Group justify="space-between" align="center">
      <Group gap="xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          leftSection={<IconChevronLeft size={16} />}
        >
          Anterior
        </Button>
        
        {renderPageNumbers()}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          rightSection={<IconChevronRight size={16} />}
        >
          Próximo
        </Button>
      </Group>

      <Group gap="md" align="center">
        <Text size="sm" c="dimmed">
          Página {page} de {totalPages} • {total} resultado{total !== 1 ? 's' : ''}
        </Text>
        <Select
          data={LIMIT_OPTIONS}
          value={limit.toString()}
          onChange={handleLimitChange}
          style={{ minWidth: '150px' }}
        />
      </Group>
    </Group>
  );
}
