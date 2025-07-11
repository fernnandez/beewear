import { ValueCard } from "@components/shared/ValueCard/ValueCard";
import { ProductDetails } from "@localTypes/product";
import { Stack } from "@mantine/core";
import {
  IconPackage,
  IconPalette,
  IconShoppingCart,
} from "@tabler/icons-react";

interface ProductStatsGridProps {
  product: ProductDetails;
}

export function ProductStatsGrid({ product }: ProductStatsGridProps) {
  const totalStock = product.aggregations.totalStock;
  const totalValue = product.aggregations.totalValue;
  const totalVariations = product.variations.length;

  return (
    <Stack>
      <ValueCard
        title="Estoque Total"
        value={totalStock}
        description="unidades em estoque"
        icon={<IconPackage size={16} />}
        iconColor="blue"
        valueColor="blue"
      />

      <ValueCard
        title="Valor Total"
        value={`R$ ${totalValue.toFixed(2).replace(".", ",")}`}
        description="valor em estoque"
        icon={<IconShoppingCart size={16} />}
        iconColor="green"
        valueColor="green"
      />

      <ValueCard
        title="Variações"
        value={totalVariations}
        description="cores disponíveis"
        icon={<IconPalette size={16} />}
        iconColor="orange"
        valueColor="orange"
      />
    </Stack>
  );
}
