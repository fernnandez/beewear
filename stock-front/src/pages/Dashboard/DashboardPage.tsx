"use client";

import { AppShellLayout } from "@components/AppShell";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconPackage,
  IconPlus,
  IconShoppingBag,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Dados simulados
const mockProducts = [
  {
    id: 1,
    name: "Camiseta Básica",
    category: "Camisetas",
    stock: 5,
    minStock: 10,
    price: 29.9,
    size: "M",
  },
  {
    id: 2,
    name: "Calça Jeans",
    category: "Calças",
    stock: 15,
    minStock: 5,
    price: 89.9,
    size: "38",
  },
  {
    id: 3,
    name: "Vestido Floral",
    category: "Vestidos",
    stock: 2,
    minStock: 8,
    price: 79.9,
    size: "P",
  },
  {
    id: 4,
    name: "Blusa Social",
    category: "Blusas",
    stock: 12,
    minStock: 6,
    price: 59.9,
    size: "G",
  },
  {
    id: 5,
    name: "Saia Midi",
    category: "Saias",
    stock: 8,
    minStock: 4,
    price: 49.9,
    size: "M",
  },
];

export default function DashboardPage() {
  const [products] = useState(mockProducts);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  );
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  return (
    <AppShellLayout>
      <Container size="xl">
        <Title order={2} mb="md">
          Dashboard
        </Title>
        <Text c="dimmed" mb="xl">
          Visão geral do seu estoque
        </Text>

        {/* Métricas */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500} c="dimmed">
                Total de Produtos
              </Text>
              <ThemeIcon variant="light" color="blue" size="sm">
                <IconPackage size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2}>{totalProducts}</Title>
            <Text size="xs" c="dimmed">
              itens cadastrados
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500} c="dimmed">
                Valor Total
              </Text>
              <ThemeIcon variant="light" color="blue" size="sm">
                <IconTrendingUp size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2}>R$ {totalValue.toFixed(2)}</Title>
            <Text size="xs" c="dimmed">
              em estoque
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500} c="dimmed">
                Estoque Baixo
              </Text>
              <ThemeIcon variant="light" color="yellow" size="sm">
                <IconAlertTriangle size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="yellow">
              {lowStockProducts.length}
            </Title>
            <Text size="xs" c="dimmed">
              produtos em alerta
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500} c="dimmed">
                Sem Estoque
              </Text>
              <ThemeIcon variant="light" color="red" size="sm">
                <IconShoppingBag size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="red">
              {outOfStockProducts.length}
            </Title>
            <Text size="xs" c="dimmed">
              produtos esgotados
            </Text>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
          {/* Produtos com Estoque Baixo */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group>
                <IconAlertTriangle
                  size={18}
                  color="var(--mantine-color-yellow-6)"
                />
                <Title order={4}>Alertas de Estoque</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Produtos que precisam de reposição
              </Text>
            </Card.Section>

            <Stack mt="md" gap="sm">
              {lowStockProducts.length === 0 ? (
                <Text c="dimmed" size="sm">
                  Nenhum produto com estoque baixo
                </Text>
              ) : (
                lowStockProducts.map((product) => (
                  <Paper
                    key={product.id}
                    p="md"
                    radius="md"
                    bg="var(--mantine-color-yellow-0)"
                    withBorder
                  >
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>{product.name}</Text>
                        <Text size="sm" c="dimmed">
                          {product.category} • Tamanho {product.size}
                        </Text>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Badge color="yellow" variant="outline">
                          {product.stock} unidades
                        </Badge>
                        <Text size="xs" c="dimmed" mt={4}>
                          Mín: {product.minStock}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))
              )}
            </Stack>
          </Card>

          {/* Produtos Recentes */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Title order={4}>Produtos Cadastrados</Title>
              <Text size="sm" c="dimmed">
                Últimos produtos adicionados ao sistema
              </Text>
            </Card.Section>

            <Stack mt="md" gap="sm">
              {products.slice(0, 5).map((product) => (
                <Paper
                  key={product.id}
                  p="md"
                  radius="md"
                  bg="var(--mantine-color-gray-0)"
                  withBorder
                >
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{product.name}</Text>
                      <Text size="sm" c="dimmed">
                        {product.category} • R$ {product.price.toFixed(2)}
                      </Text>
                    </div>
                    <Badge
                      color={
                        product.stock === 0
                          ? "red"
                          : product.stock <= product.minStock
                          ? "yellow"
                          : "blue"
                      }
                    >
                      {product.stock} em estoque
                    </Badge>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Button
              component={Link}
              to="/products"
              variant="outline"
              fullWidth
              mt="md"
            >
              Ver Todos os Produtos
            </Button>
          </Card>
        </SimpleGrid>

        {/* Ações Rápidas */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={4}>Ações Rápidas</Title>
            <Text size="sm" c="dimmed">
              Acesse rapidamente as principais funcionalidades
            </Text>
          </Card.Section>

          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
            <Button
              component={Link}
              to="/products/new"
              variant="outline"
              h={rem(80)}
              leftSection={<IconPlus size={24} />}
            >
              Cadastrar Produto
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outline"
              h={rem(80)}
              leftSection={<IconPackage size={24} />}
            >
              Gerenciar Estoque
            </Button>
            <Button
              component={Link}
              to="/reports"
              variant="outline"
              h={rem(80)}
              leftSection={<IconTrendingUp size={24} />}
            >
              Relatórios
            </Button>
          </SimpleGrid>
        </Card>
      </Container>
    </AppShellLayout>
  );
}
