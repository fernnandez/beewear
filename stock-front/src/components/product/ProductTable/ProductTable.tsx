import { Product } from "@localTypes/product";
import { Table, Text, Center, Group, ActionIcon, Tooltip } from "@mantine/core";
import { IconChevronUp, IconChevronDown, IconArrowsSort } from "@tabler/icons-react";
import { ProductLine } from "./ProductLine";
import type { ProductSortOptions } from "../../../types/product-filters";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  sortOptions: ProductSortOptions;
  onSortChange: (sortOptions: ProductSortOptions) => void;
}

export const ProductTable = ({ products, isLoading, sortOptions, onSortChange }: ProductTableProps) => {
  const handleSort = (field: 'name' | 'createdAt' | 'updatedAt' | 'price') => {
    const newSortOrder = sortOptions.sortBy === field && sortOptions.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSortChange({
      sortBy: field,
      sortOrder: newSortOrder,
    });
  };

  const getSortIcon = (field: 'name' | 'createdAt' | 'updatedAt' | 'price') => {
    if (sortOptions.sortBy !== field) {
      return <IconArrowsSort size={14} />;
    }
    return sortOptions.sortOrder === 'ASC' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
  };

  const SortableHeader = ({ field, children }: { field: 'name' | 'createdAt' | 'updatedAt' | 'price'; children: React.ReactNode }) => (
    <Table.Th>
      <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort(field)}>
        <Text size="sm" fw={500}>{children}</Text>
        <Tooltip label={`Ordenar por ${children}`}>
          <ActionIcon size="xs" variant="subtle">
            {getSortIcon(field)}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Th>
  );
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <SortableHeader field="name">Produto</SortableHeader>
          <Table.Th>Coleção</Table.Th>
          <Table.Th>Variações</Table.Th>
          <SortableHeader field="price">Preço</SortableHeader>
          <Table.Th>Status</Table.Th>
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {isLoading ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Center py="xl">
                <Text c="dimmed">Carregando produtos...</Text>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : products.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Center py="xl">
                <Text c="dimmed">Nenhum produto encontrado</Text>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : (
          products.map((product) => {
            return <ProductLine key={product.publicId} product={product} />;
          })
        )}
      </Table.Tbody>
    </Table>
  );
};
