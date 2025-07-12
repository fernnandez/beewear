import { LowStockAlertDto } from "@localTypes/product";
import { Card, Stack, Text } from "@mantine/core";

interface StockAlertProps {
  alerts: LowStockAlertDto[];
}

export const StockAlert = ({ alerts }: StockAlertProps) => {
  return (
    <Card withBorder radius="md" p="lg">
      <Text size="lg" fw={500} mb="sm">
        Produtos com Estoque Baixo
      </Text>

      {alerts.length === 0 ? (
        <Text size="sm" c="dimmed">
          Nenhum alerta de estoque no momento.
        </Text>
      ) : (
        <Stack gap="xs">
          {alerts.map((alert) => (
            <Card
              key={`${alert.name}-${alert.size}`}
              shadow="sm"
              p="sm"
              radius="md"
              withBorder
            >
              <Stack gap={0}>
                <Text size="sm" fw={500}>
                  {alert.name} ({alert.size})
                </Text>
                <Text size="xs" c="dimmed">
                  Categoria: {alert.category}
                </Text>
                <Text size="xs" c="orange">
                  Estoque atual: {alert.stock} | Mínimo: {alert.minStock}
                </Text>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Card>
  );
};
