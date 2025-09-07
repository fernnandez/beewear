import { ProductTable } from "@components/product/ProductTable/ProductTable";
import { FilterBar, Pagination } from "@components/shared";
import { Button, Card, Container, Group, Title, Text } from "@mantine/core";
import { fetchCollections } from "@services/collection.service";
import { IconPackage, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsPaginated } from "../../hooks/useProductsPaginated";
import { usePagination } from "../../hooks/usePagination";
import type {
  ProductFilters,
  ProductSortOptions,
} from "../../types/product-filters";
import type { PaginatedResponse } from "../../types/pagination";
import type { Product } from "../../types/product";

export default function ProductsPage() {
  const navigate = useNavigate();

  // Pagination state
  const { pagination, setPage, setLimit, resetPagination, updatePagination } =
    usePagination({
      initialPage: 1,
      initialLimit: 20,
    });

  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({});

  // Sort state
  const [sortOptions, setSortOptions] = useState<ProductSortOptions>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  // Fetch collections for filter dropdown
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  // Fetch paginated products
  const { data: productsData, isLoading } = useProductsPaginated({
    page: pagination.page,
    limit: pagination.limit,
    ...filters,
    ...sortOptions,
  }) as { data: PaginatedResponse<Product> | undefined; isLoading: boolean };

  // Update pagination when data changes
  useEffect(() => {
    if (productsData) {
      updatePagination(productsData.total, productsData.totalPages);
    }
  }, [productsData, updatePagination]);

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [filters, sortOptions, resetPagination]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOptions: ProductSortOptions) => {
    setSortOptions(newSortOptions);
  };

  return (
    <>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Produtos</Title>
            <Text c="dimmed">Gerencie seus produtos e variações</Text>
          </div>
          <Button
            onClick={() => navigate("/products/new")}
            leftSection={<IconPlus size={16} />}
          >
            Novo Produto
          </Button>
        </Group>

        {/* Filtros */}
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          collections={collections.map((c) => ({
            id: c.publicId,
            name: c.name,
          }))}
        />

        {/* Lista de Produtos */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPackage size={18} />
              <Title order={4}>
                Lista de Produtos ({productsData?.total || 0})
              </Title>
            </Group>
          </Card.Section>

          <ProductTable
            products={productsData?.data || []}
            isLoading={isLoading}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
          />
        </Card>

        {/* Paginação */}
        {productsData && productsData.totalPages > 1 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </Card>
        )}
      </Container>
    </>
  );
}
