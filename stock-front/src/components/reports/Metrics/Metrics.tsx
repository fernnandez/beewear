import { ValueCard } from "@components/shared/ValueCard/ValueCard";
import { SimpleGrid } from "@mantine/core";
import {
  IconAlertTriangle,
  IconPackage,
  IconShoppingBag,
  IconTrendingUp,
} from "@tabler/icons-react";

export const Metrics = ({
  totalProducts,
  totalValue,
  lowStockCount,
  noStockCount,
}: {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  noStockCount: number;
}) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
      <ValueCard
        title="Total de Produtos"
        value={totalProducts}
        description="itens cadastrados"
        icon={<IconPackage size={16} />}
        iconColor="blue"
        valueColor="blue"
      />

      <ValueCard
        title="Valor Total"
        value={`€ ${totalValue.toFixed(2)}`}
        description="em estoque"
        icon={<IconTrendingUp size={16} />}
        iconColor="green"
        valueColor="green"
      />

      <ValueCard
        title="Estoque Baixo"
        value={lowStockCount}
        description="produtos em alerta"
        icon={<IconAlertTriangle size={16} />}
        iconColor="orange"
        valueColor="orange"
      />

      <ValueCard
        title="Sem Estoque"
        value={noStockCount}
        description="produtos esgotados"
        icon={<IconShoppingBag size={16} />}
        iconColor="red"
        valueColor="red"
      />
    </SimpleGrid>
  );
};
