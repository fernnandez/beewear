import { Badge, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";

const stockMovements = [
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
];

export const RecentMovements = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Title order={4}>Movimentações Recentes</Title>
        <Text size="sm" c="dimmed">
          Últimas entradas e saídas do estoque
        </Text>
      </Card.Section>

      <Stack gap="md">
        {stockMovements.map((movement, index) => (
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
  );
};
