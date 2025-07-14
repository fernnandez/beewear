import { LowStockAlertDto } from "@localTypes/product";
import { Badge, Card, ScrollArea, Stack, Text } from "@mantine/core";

interface WithoutStockProps {
  alerts: LowStockAlertDto[];
}

export const WithoutStock = ({ alerts }: WithoutStockProps) => {
  return (
    <Card withBorder radius="md" p="lg">
      <Text size="lg" fw={500} mb="sm">
        Produtos com Estoque Esgotado
      </Text>

      {alerts.length === 0 ? (
        <Text size="sm" c="dimmed">
          Nenhum alerta de estoque no momento.
        </Text>
      ) : (
        <Stack gap="xs">
          <ScrollArea h={300}>
            {alerts.map((alert) => (
              <Card
                key={`${alert.name}-${alert.size}`}
                shadow="sm"
                p="sm"
                radius="md"
                mt={"xs"}
                mb={"xs"}
                withBorder
              >
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {alert.name} <Badge>{alert.size}</Badge>
                  </Text>
                  <Text size="xs" c="dimmed">
                    Coleção: {alert.category}
                  </Text>
                </Stack>
              </Card>
            ))}
          </ScrollArea>
        </Stack>
      )}
    </Card>
  );
};
