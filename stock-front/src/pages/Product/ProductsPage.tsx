"use client";

import { AppShellLayout } from "@components/AppShell";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Container,
  Flex,
  Group,
  Menu,
  Paper,
  Progress,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconPackage,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "src/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Básica",
    description: "Camiseta básica de algodão 100%",
    category: "Camisetas",
    brand: "BasicWear",
    supplier: "Fornecedor A",
    basePrice: 29.9,
    isActive: true,
    totalStock: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    variations: [
      {
        id: "1-1",
        productId: "1",
        sku: "CAM001-P-BR",
        size: "P",
        color: "Branco",
        stock: 15,
        minStock: 5,
        price: 29.9,
        isActive: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "1-2",
        productId: "1",
        sku: "CAM001-M-BR",
        size: "M",
        color: "Branco",
        stock: 20,
        minStock: 8,
        price: 29.9,
        isActive: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "1-3",
        productId: "1",
        sku: "CAM001-G-PR",
        size: "G",
        color: "Preto",
        stock: 10,
        minStock: 5,
        price: 32.9,
        isActive: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    name: "Calça Jeans Skinny",
    description: "Calça jeans skinny com elastano",
    category: "Calças",
    brand: "DenimStyle",
    supplier: "Fornecedor B",
    basePrice: 89.9,
    isActive: true,
    totalStock: 28,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    variations: [
      {
        id: "2-1",
        productId: "2",
        sku: "CAL001-36-AZ",
        size: "36",
        color: "Azul",
        stock: 8,
        minStock: 3,
        price: 89.9,
        isActive: true,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
      },
      {
        id: "2-2",
        productId: "2",
        sku: "CAL001-38-AZ",
        size: "38",
        color: "Azul",
        stock: 12,
        minStock: 5,
        price: 89.9,
        isActive: true,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
      },
      {
        id: "2-3",
        productId: "2",
        sku: "CAL001-40-PR",
        size: "40",
        color: "Preto",
        stock: 8,
        minStock: 3,
        price: 94.9,
        isActive: true,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
      },
    ],
  },
  {
    id: "3",
    name: "Vestido Floral",
    description: "Vestido floral para verão",
    category: "Vestidos",
    brand: "FloralFashion",
    supplier: "Fornecedor C",
    basePrice: 79.9,
    isActive: true,
    totalStock: 15,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    variations: [
      {
        id: "3-1",
        productId: "3",
        sku: "VES001-P-FL",
        size: "P",
        color: "Floral Rosa",
        stock: 5,
        minStock: 2,
        price: 79.9,
        isActive: true,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-05",
      },
      {
        id: "3-2",
        productId: "3",
        sku: "VES001-M-FL",
        size: "M",
        color: "Floral Rosa",
        stock: 3,
        minStock: 2,
        price: 79.9,
        isActive: true,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-05",
      },
      {
        id: "3-3",
        productId: "3",
        sku: "VES001-G-AZ",
        size: "G",
        color: "Floral Azul",
        stock: 7,
        minStock: 3,
        price: 84.9,
        isActive: true,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-05",
      },
    ],
  },
];

const categories = [
  "Todas",
  "Camisetas",
  "Calças",
  "Vestidos",
  "Blusas",
  "Saias",
  "Casacos",
  "Shorts",
];

export default function ProductsPage() {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Todas"
  );
  const [stockFilter, setStockFilter] = useState<string | null>("Todos");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set()
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variations.some((v) =>
        v.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;

    const hasLowStock = product.variations.some((v) => v.stock <= v.minStock);
    const hasOutOfStock = product.variations.some((v) => v.stock === 0);
    const hasNormalStock = product.variations.some((v) => v.stock > v.minStock);

    const matchesStock =
      stockFilter === "Todos" ||
      (stockFilter === "Baixo" && hasLowStock) ||
      (stockFilter === "Sem Estoque" && hasOutOfStock) ||
      (stockFilter === "Normal" && hasNormalStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getProductStockStatus = (product: Product) => {
    const lowStockVariations = product.variations.filter(
      (v) => v.stock <= v.minStock && v.stock > 0
    );
    const outOfStockVariations = product.variations.filter(
      (v) => v.stock === 0
    );

    if (outOfStockVariations.length > 0) {
      return {
        label: `${outOfStockVariations.length} sem estoque`,
        color: "red",
      };
    }
    if (lowStockVariations.length > 0) {
      return {
        label: `${lowStockVariations.length} estoque baixo`,
        color: "yellow",
      };
    }
    return { label: "Estoque normal", color: "green" };
  };

  const getVariationStockStatus = (variation: any) => {
    if (variation.stock === 0) return { label: "Sem Estoque", color: "red" };
    if (variation.stock <= variation.minStock)
      return { label: "Estoque Baixo", color: "yellow" };
    return { label: "Normal", color: "green" };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todas");
    setStockFilter("Todos");
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Produtos</Title>
            <Text c="dimmed">Gerencie seus produtos e variações</Text>
          </div>
          <Button
            component={Link}
            to="/products/new"
            leftSection={<IconPlus size={16} />}
          >
            Novo Produto
          </Button>
        </Group>

        {/* Filtros */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconFilter size={18} />
              <Title order={4}>Filtros</Title>
            </Group>
          </Card.Section>

          <Flex gap="md" wrap="wrap">
            <TextInput
              placeholder="Buscar por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, minWidth: "200px" }}
            />

            <Select
              placeholder="Categoria"
              data={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ minWidth: "150px" }}
            />

            <Select
              placeholder="Status do Estoque"
              data={[
                { value: "Todos", label: "Todos" },
                { value: "Normal", label: "Estoque Normal" },
                { value: "Baixo", label: "Estoque Baixo" },
                { value: "Sem Estoque", label: "Sem Estoque" },
              ]}
              value={stockFilter}
              onChange={setStockFilter}
              style={{ minWidth: "150px" }}
            />

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </Flex>
        </Card>

        {/* Lista de Produtos */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPackage size={18} />
              <Title order={4}>
                Lista de Produtos ({filteredProducts.length})
              </Title>
            </Group>
          </Card.Section>

          {filteredProducts.length > 0 ? (
            <Stack gap="md">
              {filteredProducts.map((product) => {
                const isExpanded = expandedProducts.has(product.id);
                const stockStatus = getProductStockStatus(product);

                return (
                  <Card
                    key={product.id}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                  >
                    {/* Cabeçalho do Produto */}
                    <Group justify="space-between" mb="sm">
                      <Group>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => toggleProductExpansion(product.id)}
                          size="sm"
                        >
                          {isExpanded ? (
                            <IconChevronDown size={16} />
                          ) : (
                            <IconChevronRight size={16} />
                          )}
                        </ActionIcon>
                        <Avatar color="blue" radius="sm" size="md">
                          {product.name.charAt(0)}
                        </Avatar>
                        <div>
                          <Text fw={500} size="lg">
                            {product.name}
                          </Text>
                          <Group gap="xs">
                            <Badge variant="light" color="blue" size="sm">
                              {product.category}
                            </Badge>
                            <Badge
                              variant="light"
                              color={stockStatus.color}
                              size="sm"
                            >
                              {stockStatus.label}
                            </Badge>
                            <Text size="sm" c="dimmed">
                              {product.variations.length} variações
                            </Text>
                          </Group>
                        </div>
                      </Group>

                      <Group>
                        <Stack align="end" gap={2}>
                          <Text fw={500}>
                            R$ {product.basePrice.toFixed(2)}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {product.totalStock} total
                          </Text>
                        </Stack>
                        <Menu position="bottom-end" withArrow>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEye size={14} />}>
                              Ver Detalhes
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />}>
                              Editar Produto
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPackage size={14} />}>
                              Gerenciar Variações
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                            >
                              Excluir
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>

                    {/* Barra de Progresso do Estoque */}
                    <div style={{ marginBottom: "1rem" }}>
                      <Group justify="space-between" mb={5}>
                        <Text size="sm" c="dimmed">
                          Estoque por variação
                        </Text>
                        <Text size="sm" c="dimmed">
                          {product.variations.filter((v) => v.stock > 0).length}{" "}
                          de {product.variations.length} com estoque
                        </Text>
                      </Group>
                      <Progress
                        value={
                          (product.variations.filter((v) => v.stock > 0)
                            .length /
                            product.variations.length) *
                          100
                        }
                        color={stockStatus.color}
                        size="sm"
                        radius="xl"
                      />
                    </div>

                    {/* Variações (Expandível) */}
                    <Collapse in={isExpanded}>
                      <Card
                        withBorder
                        radius="md"
                        bg="var(--mantine-color-gray-0)"
                      >
                        <Card.Section withBorder inheritPadding py="xs" mb="md">
                          <Group justify="space-between">
                            <Title order={5}>Variações do Produto</Title>
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconPlus size={14} />}
                            >
                              Nova Variação
                            </Button>
                          </Group>
                        </Card.Section>

                        <Table striped highlightOnHover>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>SKU</Table.Th>
                              <Table.Th>Tamanho</Table.Th>
                              <Table.Th>Cor</Table.Th>
                              <Table.Th>Preço</Table.Th>
                              <Table.Th>Estoque</Table.Th>
                              <Table.Th>Status</Table.Th>
                              <Table.Th></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {product.variations.map((variation) => {
                              const variationStatus =
                                getVariationStockStatus(variation);
                              return (
                                <Table.Tr key={variation.id}>
                                  <Table.Td ff="monospace">
                                    {variation.sku}
                                  </Table.Td>
                                  <Table.Td>{variation.size}</Table.Td>
                                  <Table.Td>
                                    <Group gap="xs">
                                      <div
                                        style={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: "50%",
                                          backgroundColor: variation.color
                                            .toLowerCase()
                                            .includes("branco")
                                            ? "#fff"
                                            : variation.color
                                                .toLowerCase()
                                                .includes("preto")
                                            ? "#000"
                                            : variation.color
                                                .toLowerCase()
                                                .includes("azul")
                                            ? "#1c7ed6"
                                            : variation.color
                                                .toLowerCase()
                                                .includes("rosa")
                                            ? "#e64980"
                                            : "#868e96",
                                          border: "1px solid #dee2e6",
                                        }}
                                      />
                                      {variation.color}
                                    </Group>
                                  </Table.Td>
                                  <Table.Td>
                                    R$ {variation.price.toFixed(2)}
                                  </Table.Td>
                                  <Table.Td>
                                    <Text
                                      c={
                                        variation.stock <= variation.minStock
                                          ? "red"
                                          : "green"
                                      }
                                      fw={500}
                                      span
                                    >
                                      {variation.stock}
                                    </Text>
                                    <Text c="dimmed" size="sm" span>
                                      {" "}
                                      / {variation.minStock}
                                    </Text>
                                  </Table.Td>
                                  <Table.Td>
                                    <Badge
                                      color={variationStatus.color}
                                      size="sm"
                                    >
                                      {variationStatus.label}
                                    </Badge>
                                  </Table.Td>
                                  <Table.Td>
                                    <Menu position="bottom-end" withArrow>
                                      <Menu.Target>
                                        <ActionIcon variant="subtle" size="sm">
                                          <IconDotsVertical size={14} />
                                        </ActionIcon>
                                      </Menu.Target>
                                      <Menu.Dropdown>
                                        <Menu.Item
                                          leftSection={<IconEdit size={12} />}
                                        >
                                          Editar
                                        </Menu.Item>
                                        <Menu.Item
                                          leftSection={
                                            <IconPackage size={12} />
                                          }
                                        >
                                          Ajustar Estoque
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                          leftSection={<IconTrash size={12} />}
                                          color="red"
                                        >
                                          Excluir
                                        </Menu.Item>
                                      </Menu.Dropdown>
                                    </Menu>
                                  </Table.Td>
                                </Table.Tr>
                              );
                            })}
                          </Table.Tbody>
                        </Table>
                      </Card>
                    </Collapse>
                  </Card>
                );
              })}
            </Stack>
          ) : (
            <Paper p="xl" withBorder>
              <Flex direction="column" align="center" gap="md">
                <IconPackage size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed">Nenhum produto encontrado</Text>
              </Flex>
            </Paper>
          )}
        </Card>
      </Container>
    </AppShellLayout>
  );
}
