import {
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  NumberInput,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter, IconX, IconSearch } from '@tabler/icons-react';
import { BaseFilters } from '../../../types/pagination';

interface FilterBarProps<T extends BaseFilters> {
  filters: T;
  onFiltersChange: (filters: Partial<T>) => void;
  onReset: () => void;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
  showAdvancedFilters?: boolean;
  children?: React.ReactNode;
}

export function FilterBar<T extends BaseFilters>({
  filters,
  onFiltersChange,
  onReset,
  onSearch,
  searchPlaceholder = 'Buscar...',
  showAdvancedFilters = true,
  children,
}: FilterBarProps<T>) {
  const [opened, { toggle }] = useDisclosure(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value } as Partial<T>);
    onSearch?.(value);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <TextInput
          placeholder={searchPlaceholder}
          value={filters.search || ''}
          onChange={(event) => handleSearchChange(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, maxWidth: 400 }}
        />

        <Group gap="xs">
          {showAdvancedFilters && (
            <Button
              variant="outline"
              leftSection={<IconFilter size={16} />}
              onClick={toggle}
            >
              Filtros
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              variant="subtle"
              color="red"
              leftSection={<IconX size={16} />}
              onClick={onReset}
            >
              Limpar
            </Button>
          )}
        </Group>
      </Group>

      <Collapse in={opened}>
        <Stack gap="md" p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          {children}
        </Stack>
      </Collapse>
    </Stack>
  );
}

// Componentes específicos para filtros comuns
export function StatusFilter({
  value,
  onChange,
  label = 'Status',
  data = [],
}: {
  value?: string;
  onChange: (value: string | null) => void;
  label?: string;
  data?: { value: string; label: string }[];
}) {
  return (
    <Select
      label={label}
      placeholder="Selecionar status"
      value={value}
      onChange={onChange}
      data={data}
      clearable
    />
  );
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
}) {
  return (
    <Group grow>
      <TextInput
        label="Data inicial"
        placeholder="YYYY-MM-DD"
        value={startDate || ''}
        onChange={(event) => onStartDateChange(event.currentTarget.value || null)}
        type="date"
      />
      <TextInput
        label="Data final"
        placeholder="YYYY-MM-DD"
        value={endDate || ''}
        onChange={(event) => onEndDateChange(event.currentTarget.value || null)}
        type="date"
      />
    </Group>
  );
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: {
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: number | string) => void;
  onMaxPriceChange: (value: number | string) => void;
}) {
  return (
    <Group grow>
      <NumberInput
        label="Preço mínimo"
        placeholder="0.00"
        value={minPrice}
        onChange={onMinPriceChange}
        min={0}
        decimalScale={2}
        prefix="R$ "
      />
      <NumberInput
        label="Preço máximo"
        placeholder="999.99"
        value={maxPrice}
        onChange={onMaxPriceChange}
        min={0}
        decimalScale={2}
        prefix="R$ "
      />
    </Group>
  );
}
