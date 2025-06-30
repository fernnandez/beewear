import { Card, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import {
  IconPackage,
  IconPalette,
  IconShoppingCart,
} from "@tabler/icons-react";

interface ProductStatsGridProps {
  product: any;
}

export function ProductStatsGrid({ product }: ProductStatsGridProps) {
  const totalStock = product.aggregations.totalStock;
  const totalValue = product.aggregations.totalValue;
  const totalVariations = product.variations.length;

  return (
    <Stack>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Estoque Total
          </Text>
          <ThemeIcon variant="light" color="blue" size="sm">
            <IconPackage size={16} />
          </ThemeIcon>
        </Group>
        <Title order={2} c="blue">
          {totalStock}
        </Title>
        <Text size="xs" c="dimmed">
          unidades em estoque
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Valor Total
          </Text>
          <ThemeIcon variant="light" color="green" size="sm">
            <IconShoppingCart size={16} />
          </ThemeIcon>
        </Group>
        <Title order={2} c="green">
          R$ {totalValue.toFixed(2).replace(".", ",")}
        </Title>
        <Text size="xs" c="dimmed">
          valor em estoque
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="dimmed">
            Variações
          </Text>
          <ThemeIcon variant="light" color="purple" size="sm">
            <IconPalette size={16} />
          </ThemeIcon>
        </Group>
        <Title order={2} c="purple">
          {totalVariations}
        </Title>
        <Text size="xs" c="dimmed">
          cores disponíveis
        </Text>
      </Card>
    </Stack>
  );
}
