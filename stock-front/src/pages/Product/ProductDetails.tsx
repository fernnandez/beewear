import { ProductInfoCard, ProductStatusCard } from "@components/product/cards";
import { ProductStatsGrid } from "@components/product/details";
import { ProductVariationsSection } from "@components/product/ProductVariationsSection/ProductVariationsSection";
import { StorePreview } from "@components/product/StorePreview/StorePreview";
import {
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchProductDetails } from "@services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details", publicId],
    queryFn: () => fetchProductDetails(publicId!),
    enabled: !!publicId,
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Nome é obrigatório" : null,
    },
  });

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!product || isLoading) {
    return (
      <Container size="xl">
        <Text>Carregando detalhes do produto...</Text>
      </Container>
    );
  }

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
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Button variant="subtle" onClick={() => navigate("/products")}>
            ← Voltar
          </Button>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="xl">
        {/* Informações do Produto */}
        <div style={{ gridColumn: "span 2" }}>
          <Stack gap="lg">
            <ProductInfoCard
              product={product}
              form={form}
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
        </div>

        {/* Estatísticas */}
        <ProductStatsGrid product={product} />
      </SimpleGrid>

      {/* Variações do Produto */}
      <ProductVariationsSection
        productPublicId={product.publicId}
        variations={product.variations}
      />

      <Divider mt={50} mb={50} />

      {/* Preview da Vitrine */}
      <StorePreview product={product} variations={product.variations} />
    </Container>
  );
}
