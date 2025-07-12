import { StockMovementSummaryDto } from "@localTypes/product";
import { Badge, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";

interface RecentMovementsProps {
  movements: StockMovementSummaryDto[];
}

export const RecentMovements = ({ movements }: RecentMovementsProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Title order={4}>Movimentações Recentes</Title>
        <Text size="sm" c="dimmed">
          Últimas entradas e saídas do estoque
        </Text>
      </Card.Section>

      <Stack gap="md">
        {movements.map((movement, index) => (
          <Paper key={index} p="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text fw={500}>{movement.productName}</Text>
                <Text size="sm" c="dimmed">
                  {movement.date} • {movement.quantity}
                </Text>
              </div>
              <Badge
                color={movement.type === "Compra" ? "green" : "red"}
                variant="light"
                size="lg"
              >
                {movement.type === "Compra" ? "+" : "-"}
                {movement.quantity}
              </Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Card>
  );
};
