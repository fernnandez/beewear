import { ProductInfoSection } from "@components/product/ProductInfoSection/ProductInfoSection";
import { ProductVariationsSection } from "@components/product/ProductVariationsSection/ProductVariationsSection";
import { StorePreview } from "@components/product/StorePreview/StorePreview";
import { Button, Container, Divider, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchProductDetails } from "@services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

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

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Button variant="light" onClick={() => navigate("/products")}>
            ← Voltar
          </Button>
        </div>
      </Group>

      <ProductInfoSection product={product} />

      {/* Variações do Produto */}
      <ProductVariationsSection
        productPublicId={product.publicId}
        variations={product.variations}
      />

      <Divider mt={50} mb={50} />

      {/* Preview da Vitrine */}
      <StorePreview product={product} />
    </Container>
  );
}
