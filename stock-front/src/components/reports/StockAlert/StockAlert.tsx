import { Badge, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

const lowStockProducts = [
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
    id: 3,
    name: "Vestido Floral",
    category: "Vestidos",
    stock: 2,
    minStock: 8,
    price: 79.9,
    size: "P",
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

export const StockAlert = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <IconAlertTriangle size={18} color="var(--mantine-color-orange-6)" />
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
                  <Badge  variant="outline">
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
  );
};
