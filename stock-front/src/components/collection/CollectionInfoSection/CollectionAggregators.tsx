import { ValueCard } from "@components/shared/ValueCard/ValueCard";
import { Stack } from "@mantine/core";
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
      <ValueCard
        title="Total de Produtos"
        value={aggregations.totalProducts}
        description="produtos e suas variações nesta coleção"
        icon={<IconPackage size={16} />}
        iconColor="blue"
        valueColor="blue"
      />

      <ValueCard
        title="Valor Total"
        value={`€ ${aggregations.totalValue.toFixed(2)}`}
        description="valor em estoque"
        icon={<IconShoppingCart size={16} />}
        iconColor="green"
        valueColor="green"
      />

      <ValueCard
        title="Estoque Total"
        value={aggregations.totalStock}
        description="unidades disponíveis"
        icon={<IconPackage size={16} />}
        iconColor="orange"
        valueColor="orange"
      />
    </Stack>
  );
}
