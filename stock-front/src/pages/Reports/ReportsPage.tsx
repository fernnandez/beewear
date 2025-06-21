import { AppShellLayout } from "@components/AppShell";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCurrencyDollar,
  IconDownload,
  IconPackage,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useState } from "react";

// Dados simulados para relatórios
const reportData = {
  totalProducts: 45,
  totalValue: 12450.5,
  lowStockItems: 8,
  outOfStockItems: 3,
  topCategories: [
    { name: "Camisetas", count: 15, value: 3200.5 },
    { name: "Calças", count: 12, value: 4800.0 },
    { name: "Vestidos", count: 8, value: 2400.0 },
    { name: "Blusas", count: 6, value: 1800.0 },
    { name: "Saias", count: 4, value: 250.0 },
  ],
  stockMovements: [
    {
      date: "2024-01-15",
      product: "Camiseta Básica",
      type: "Entrada",
      quantity: 20,
      reason: "Compra",
    },
    {
      date: "2024-01-14",
      product: "Calça Jeans",
      type: "Saída",
      quantity: 5,
      reason: "Venda",
    },
    {
      date: "2024-01-13",
      product: "Vestido Floral",
      type: "Saída",
      quantity: 2,
      reason: "Venda",
    },
    {
      date: "2024-01-12",
      product: "Blusa Social",
      type: "Entrada",
      quantity: 15,
      reason: "Compra",
    },
    {
      date: "2024-01-11",
      product: "Saia Midi",
      type: "Saída",
      quantity: 3,
      reason: "Venda",
    },
  ],
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>("30");

  const exportReport = () => {
    // Função para exportar relatório
    console.log("Exportando relatório...");
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Relatórios</Title>
            <Text c="dimmed">Análise completa do seu estoque</Text>
          </div>
          <Group>
            <Select
              placeholder="Período"
              data={[
                { value: "7", label: "Últimos 7 dias" },
                { value: "30", label: "Últimos 30 dias" },
                { value: "90", label: "Últimos 90 dias" },
                { value: "365", label: "Último ano" },
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              w={200}
            />
            <Button
              leftSection={<IconDownload size={16} />}
              onClick={exportReport}
            >
              Exportar
            </Button>
          </Group>
        </Group>

        {/* Resumo Geral */}
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
            <Title order={2}>{reportData.totalProducts}</Title>
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
                <IconCurrencyDollar size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2}>R$ {reportData.totalValue.toFixed(2)}</Title>
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
              {reportData.lowStockItems}
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
                <IconPackage size={16} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="red">
              {reportData.outOfStockItems}
            </Title>
            <Text size="xs" c="dimmed">
              produtos esgotados
            </Text>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
          {/* Top Categorias */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs" mb="md">
              <Group>
                <IconTrendingUp size={18} />
                <Title order={4}>Categorias por Valor</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Categorias com maior valor em estoque
              </Text>
            </Card.Section>

            <Stack gap="md">
              {reportData.topCategories.map((category, index) => (
                <Paper key={category.name} p="md" radius="md" withBorder>
                  <Group justify="space-between">
                    <Group>
                      <ThemeIcon
                        radius="xl"
                        size="lg"
                        variant="light"
                        color="blue"
                      >
                        {index + 1}
                      </ThemeIcon>
                      <div>
                        <Text fw={500}>{category.name}</Text>
                        <Text size="sm" c="dimmed">
                          {category.count} produtos
                        </Text>
                      </div>
                    </Group>
                    <Text fw={500}>R$ {category.value.toFixed(2)}</Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>

          {/* Movimentações Recentes */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs" mb="md">
              <Title order={4}>Movimentações Recentes</Title>
              <Text size="sm" c="dimmed">
                Últimas entradas e saídas do estoque
              </Text>
            </Card.Section>

            <Stack gap="md">
              {reportData.stockMovements.map((movement, index) => (
                <Paper key={index} p="md" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{movement.product}</Text>
                      <Text size="sm" c="dimmed">
                        {movement.date} • {movement.reason}
                      </Text>
                    </div>
                    <Badge
                      color={movement.type === "Entrada" ? "green" : "red"}
                      variant="light"
                      size="lg"
                    >
                      {movement.type === "Entrada" ? "+" : "-"}
                      {movement.quantity}
                    </Badge>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Gráfico de Estoque por Categoria */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Title order={4}>Distribuição de Estoque</Title>
            <Text size="sm" c="dimmed">
              Visualização da distribuição de produtos por categoria
            </Text>
          </Card.Section>

          <Stack gap="lg">
            {reportData.topCategories.map((category) => {
              const percentage =
                (category.count / reportData.totalProducts) * 100;
              return (
                <div key={category.name}>
                  <Group justify="space-between" mb={5}>
                    <Text fw={500}>{category.name}</Text>
                    <Text size="sm" c="dimmed">
                      {category.count} produtos ({percentage.toFixed(1)}%)
                    </Text>
                  </Group>
                  <Progress
                    value={percentage}
                    color="blue"
                    size="md"
                    radius="xl"
                    animated
                  />
                </div>
              );
            })}
          </Stack>
        </Card>
      </Container>
    </AppShellLayout>
  );
}
