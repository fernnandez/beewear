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
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Total de Produtos
          </Text>
          <IconPackage size={16} color="var(--mantine-color-blue-6)" />
        </Group>
        <Title order={2} c="blue">
          {aggregations.totalProducts}
        </Title>
        <Text size="xs" c="dimmed">
          produtos e suas variações nesta coleção
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Valor Total
          </Text>
          <IconShoppingCart size={16} color="var(--mantine-color-green-6)" />
        </Group>
        <Title order={2} c="green">
          R$ {aggregations.totalValue.toFixed(2)}
        </Title>
        <Text size="xs" c="dimmed">
          valor em estoque
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Estoque Total
          </Text>
          <IconPackage size={16} color="var(--mantine-color-orange-6)" />
        </Group>
        <Title order={2} c="orange">
          {aggregations.totalStock}
        </Title>
        <Text size="xs" c="dimmed">
          unidades disponíveis
        </Text>
      </Card>
    </Stack>
  );
}
