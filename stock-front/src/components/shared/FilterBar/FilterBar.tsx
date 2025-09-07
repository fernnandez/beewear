import {
  Button,
  Card,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { IconFilter, IconSearch, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import type { ProductFilters } from '../../../types/product-filters';

interface FilterBarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  collections: Array<{ id: string; name: string }>;
}

export function FilterBar({ filters, onFiltersChange, collections }: FilterBarProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const handleFilterChange = (key: keyof ProductFilters, value: string | boolean | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <IconFilter size={18} />
          <Text fw={500}>Filtros</Text>
        </Group>
      </Card.Section>

      <Flex gap="md" wrap="wrap" align="end">
        <TextInput
          placeholder="Buscar por nome..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, minWidth: '200px' }}
        />

        <Select
          placeholder="Coleção"
          data={[
            { value: '', label: 'Todas' },
            ...collections.map(c => ({ value: c.id, label: c.name }))
          ]}
          value={localFilters.collectionId || ''}
          onChange={(value) => handleFilterChange('collectionId', value || undefined)}
          style={{ minWidth: '150px' }}
          clearable
        />

        <Select
          placeholder="Status"
          data={[
            { value: '', label: 'Todos' },
            { value: 'true', label: 'Ativo' },
            { value: 'false', label: 'Inativo' }
          ]}
          value={localFilters.active?.toString() || ''}
          onChange={(value) => handleFilterChange('active', value === '' ? undefined : value === 'true')}
          style={{ minWidth: '120px' }}
          clearable
        />


        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            leftSection={<IconX size={16} />}
          >
            Limpar Filtros
          </Button>
        )}
      </Flex>
    </Card>
  );
}
