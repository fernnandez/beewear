import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconPackage, IconShoppingCart } from "@tabler/icons-react";

interface Aggregations {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
}

type Props = {
  aggregations: Aggregations;
};

export function CollectionAggregators({ aggregations }: Props) {
  return (
    <Stack>
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Total de Produtos
          </Text>
          <IconPackage size={16} />
        </Group>
        <Title order={2} c="blue">
          {aggregations.totalProducts}
        </Title>
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Valor Total
          </Text>
          <IconShoppingCart size={16} />
        </Group>
        <Title order={2} c="green">
          R$ {aggregations.totalValue.toFixed(2)}
        </Title>
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Estoque Total
          </Text>
          <IconPackage size={16} />
        </Group>
        <Title order={2} c="orange">
          {aggregations.totalStock}
        </Title>
      </Card>
    </Stack>
  );
}
