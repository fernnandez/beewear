"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  Container,
  TextInput,
  Select,
  Table,
  Menu,
  ActionIcon,
  Paper,
  Flex,
} from "@mantine/core"
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconPackage,
  IconDotsVertical,
} from "@tabler/icons-react"
import { AppShellLayout } from "../components/AppShell"

// Dados simulados
const mockProducts = [
  {
    id: 1,
    name: "Camiseta Básica Branca",
    category: "Camisetas",
    stock: 5,
    minStock: 10,
    price: 29.9,
    size: "M",
    sku: "CAM001",
  },
  {
    id: 2,
    name: "Calça Jeans Skinny",
    category: "Calças",
    stock: 15,
    minStock: 5,
    price: 89.9,
    size: "38",
    sku: "CAL001",
  },
  {
    id: 3,
    name: "Vestido Floral Verão",
    category: "Vestidos",
    stock: 2,
    minStock: 8,
    price: 79.9,
    size: "P",
    sku: "VES001",
  },
  {
    id: 4,
    name: "Blusa Social Preta",
    category: "Blusas",
    stock: 12,
    minStock: 6,
    price: 59.9,
    size: "G",
    sku: "BLU001",
  },
  {
    id: 5,
    name: "Saia Midi Plissada",
    category: "Saias",
    stock: 8,
    minStock: 4,
    price: 49.9,
    size: "M",
    sku: "SAI001",
  },
]

const categories = ["Todas", "Camisetas", "Calças", "Vestidos", "Blusas", "Saias", "Casacos", "Shorts"]

export default function ProductsPage() {
  const [products] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Todas")
  const [stockFilter, setStockFilter] = useState<string | null>("Todos")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory
    const matchesStock =
      stockFilter === "Todos" ||
      (stockFilter === "Baixo" && product.stock <= product.minStock) ||
      (stockFilter === "Sem Estoque" && product.stock === 0) ||
      (stockFilter === "Normal" && product.stock > product.minStock)

    return matchesSearch && matchesCategory && matchesStock
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStockStatus = (product: any) => {
    if (product.stock === 0) return { label: "Sem Estoque", color: "red" }
    if (product.stock <= product.minStock) return { label: "Estoque Baixo", color: "yellow" }
    return { label: "Normal", color: "green" }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todas")
    setStockFilter("Todos")
  }

  const rows = filteredProducts.map((product) => {
    const stockStatus = getStockStatus(product)

    return (
      <Table.Tr key={product.id}>
        <Table.Td ff="monospace">{product.sku}</Table.Td>
        <Table.Td fw={500}>{product.name}</Table.Td>
        <Table.Td>{product.category}</Table.Td>
        <Table.Td>{product.size}</Table.Td>
        <Table.Td>R$ {product.price.toFixed(2)}</Table.Td>
        <Table.Td>
          <Text c={product.stock <= product.minStock ? "red" : "green"} fw={500} span>
            {product.stock}
          </Text>
          <Text c="dimmed" size="sm" span>
            {" "}
            / {product.minStock}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge color={stockStatus.color}>{stockStatus.label}</Badge>
        </Table.Td>
        <Table.Td>
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />}>Editar</Menu.Item>
              <Menu.Item leftSection={<IconPackage size={14} />}>Ajustar Estoque</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Excluir
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Produtos</Title>
            <Text c="dimmed">Gerencie seu estoque de roupas</Text>
          </div>
          <Button component={Link} to="/products/new" leftSection={<IconPlus size={16} />}>
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

        {/* Tabela de Produtos */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPackage size={18} />
              <Title order={4}>Lista de Produtos ({filteredProducts.length})</Title>
            </Group>
          </Card.Section>

          {filteredProducts.length > 0 ? (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Categoria</Table.Th>
                  <Table.Th>Tamanho</Table.Th>
                  <Table.Th>Preço</Table.Th>
                  <Table.Th>Estoque</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
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
  )
}
