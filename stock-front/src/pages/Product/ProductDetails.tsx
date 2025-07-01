import {
  ProductInfoCard,
  ProductStatusCard,
  ProductVariationsCard,
} from "@components/product/cards";
import { ProductStatsGrid, StorePreview } from "@components/product/details";
import { EditImagesModal } from "@components/product/modals";
import {
  Button,
  Container,
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

  const [showImageModal, setShowImageModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState<any>(null);
  const [newImages, setNewImages] = useState<File[]>([]);

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

  const handleEditImages = (variation: any) => {
    setEditingVariation(variation);
    setNewImages([]);
    setShowImageModal(true);
  };

  const handleSaveImages = () => {};

  const handleRemoveImage = (variationId: string, imageIndex: number) => {
    console.log(variationId, imageIndex);
    return;
  };

  const getColorName = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "#2667ff": "Azul",
      "#ff0f0f": "Vermelho",
      "#000000": "Preto",
      "#ffffff": "Branco",
      "#00ff00": "Verde",
      "#ffff00": "Amarelo",
      "#ff00ff": "Rosa",
      "#808080": "Cinza",
    };
    return colorMap[color.toLowerCase()] || "Cor personalizada";
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

      {/* Preview da Vitrine */}
      <StorePreview product={product} variations={product.variations} />

      {/* Variações do Produto */}
      <ProductVariationsCard
        variations={product.variations}
        getColorName={getColorName}
        onEditImages={handleEditImages}
        onRemoveImage={handleRemoveImage}
      />

      {/* Modal de Edição de Imagens */}
      <EditImagesModal
        opened={showImageModal}
        onClose={() => setShowImageModal(false)}
        editingVariation={editingVariation}
        newImages={newImages}
        setNewImages={setNewImages}
        handleRemoveImage={handleRemoveImage}
        handleSaveImages={handleSaveImages}
        getColorName={getColorName}
      />
    </Container>
  );
}
