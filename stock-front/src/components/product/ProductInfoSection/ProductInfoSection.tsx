import { ProductDetails } from "@localTypes/product";
import { Grid, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ProductInfoCard } from "./ProductInfoCard";
import { ProductStatsGrid } from "./ProductStatsGrid";
import { ProductStatusCard } from "./ProductStatusCard";

interface ProductInfoSectionProps {
  product: ProductDetails;
}

export function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Nome é obrigatório" : null,
    },
  });

  const handleStartEdit = () => {
    form.setValues({
      name: product.name,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    form.setValues({
      name: product.name,
    });
    setIsEditing(false);
  };
  return (
    <Grid gutter="lg" mb="xl">
      {/* Coluna principal (2/3 da largura em telas grandes) */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="lg">
          <ProductInfoCard
            form={form}
            product={product}
            isEditing={isEditing}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
          />

          <ProductStatusCard
            name={product.name}
            publicId={product.publicId}
            isActive={product.active}
            isEditing={isEditing}
          />
        </Stack>
      </Grid.Col>

      {/* Coluna lateral (1/3 da largura em telas grandes) */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ProductStatsGrid product={product} />
      </Grid.Col>
    </Grid>
  );
}
