import { ImagePreview } from "@components/shared/ImagePreview";
import { ProductDetails } from "@localTypes/product";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconEye,
  IconHeart,
  IconPhoto,
  IconShare,
  IconShoppingBag,
  IconStar,
  IconTags,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

// TODO: ajustar tipagem aqui
export function StorePreview({ product }: { product: ProductDetails }) {
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations[0]
  );
  const [selectedSize, setSelectedSize] = useState(selectedVariation?.sizes[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const firstVariation = product.variations[0];
    setSelectedVariation(firstVariation);
    setSelectedSize(firstVariation?.sizes?.[0]);
    setSelectedImageIndex(0);
  }, [product.variations]);

  const availableColors = product.variations.map((v) => ({
    color: v.color,
    publicId: v.publicId,
  }));
  const availableSizes = selectedVariation?.sizes || [];

  const handleColorChange = (variationId: string) => {
    const newVariation = product.variations.find(
      (v) => v.publicId === variationId
    );
    if (newVariation) {
      setSelectedVariation(newVariation);
      setSelectedSize(newVariation.sizes[0]);
      setSelectedImageIndex(0);
    }
  };

  const handleSizeChange = (size: any) => {
    setSelectedSize(size);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <IconEye size={18} />
          <Title order={4}>Preview da Vitrine</Title>
          <Badge color="blue" variant="light">
            Visualização do Cliente
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          Como o produto aparecerá na loja online
        </Text>
      </Card.Section>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        {/* Galeria de Imagens */}
        <Stack align="center">
          {/* Imagem Principal */}
          <Paper withBorder radius="md" p="xs">
            <Center>
              {selectedVariation?.images &&
              selectedVariation.images.length > 0 ? (
                <ImagePreview
                  image={selectedVariation.images[selectedImageIndex]}
                  key={selectedVariation.publicId}
                  miw={500}
                  maw={500}
                />
              ) : (
                <Flex
                  h={300}
                  align="center"
                  justify="center"
                  direction="column"
                  gap="md"
                  bg="var(--mantine-color-gray-0)"
                >
                  <IconPhoto size={48} color="var(--mantine-color-gray-5)" />
                  <Text c="dimmed" size="sm">
                    Nenhuma imagem disponível
                  </Text>
                </Flex>
              )}
            </Center>
          </Paper>

          {/* Miniaturas */}
          {selectedVariation?.images && selectedVariation.images.length > 1 && (
            <Group gap="xs" align="center">
              {selectedVariation.images.map((image: string, index: number) => (
                <Paper
                  key={index}
                  withBorder
                  p={2}
                  radius="sm"
                  style={{
                    cursor: "pointer",
                    borderColor:
                      index === selectedImageIndex
                        ? "var(--mantine-color-blue-6)"
                        : undefined,
                    borderWidth: index === selectedImageIndex ? 2 : 1,
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImagePreview image={image} key={index} w={60} h={60} />
                </Paper>
              ))}
            </Group>
          )}
        </Stack>

        {/* Informações do Produto */}
        <Stack>
          <div>
            <Group mb="xs">
              <Badge variant="light" color="blue">
                {product.collection?.name || "Sem coleção"}
              </Badge>
              {product.active && (
                <Badge variant="outline" size="sm" color="green">
                  Ativo
                </Badge>
              )}
            </Group>
            <Title order={3} mb="xs">
              {product.name}
            </Title>
          </div>

          {/* Preço */}
          <Group>
            <Title order={1} fw={400}>
              R$ {selectedVariation?.price.toFixed(2).replace(".", ",")}
            </Title>
            {selectedSize?.stock.quantity <= 5 &&
              selectedSize?.stock.quantity > 0 && (
                <Badge color="yellow" size="sm">
                  Últimas unidades
                </Badge>
              )}
          </Group>

          {/* Seleção de Cor */}
          {availableColors.length > 1 && (
            <div>
              <Text size="sm" fw={500} mb="xs">
                {selectedVariation.name}
              </Text>
              <Group gap="xs">
                {availableColors.map((colorOption) => (
                  <Box
                    key={colorOption.publicId}
                    w={32}
                    h={32}
                    style={{
                      backgroundColor: colorOption.color,
                      borderRadius: "50%",
                      border:
                        selectedVariation?.publicId === colorOption.publicId
                          ? "3px solid var(--mantine-color-blue-6)"
                          : "2px solid var(--mantine-color-gray-3)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleColorChange(colorOption.publicId)}
                  />
                ))}
              </Group>
            </div>
          )}

          {availableSizes.length > 1 && (
            <div>
              <Text size="sm" fw={500} mb="xs">
                Tamanho: {selectedSize?.size}
              </Text>
              <Group gap="xs">
                {availableSizes.map((sizeOption: any) => {
                  const isAvailable = sizeOption.stock.quantity > 0;
                  const isSelected = selectedSize?.size === sizeOption.size;

                  return (
                    <Button
                      key={sizeOption.size}
                      variant={isSelected ? "filled" : "outline"}
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => handleSizeChange(sizeOption)}
                    >
                      {sizeOption.size}
                    </Button>
                  );
                })}
              </Group>
            </div>
          )}

          <Group>
            <Text size="sm" c="dimmed">
              {selectedSize?.stock.quantity > 0 ? (
                <>
                  <IconCheck
                    size={16}
                    color="var(--mantine-color-green-6)"
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  {selectedSize.stock.quantity} em estoque
                </>
              ) : (
                <>
                  <IconX
                    size={16}
                    color="var(--mantine-color-red-6)"
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  Fora de estoque
                </>
              )}
            </Text>
          </Group>

          {/* Ações */}
          <Stack gap="xs">
            <Button
              leftSection={<IconShoppingBag size={16} />}
              disabled={!selectedSize || selectedSize.stock.quantity === 0}
              size="md"
            >
              Adicionar ao Carrinho
            </Button>
            <Group grow>
              <Button variant="outline" leftSection={<IconHeart size={16} />}>
                Favoritar
              </Button>
              <Button variant="outline" leftSection={<IconShare size={16} />}>
                Compartilhar
              </Button>
            </Group>
          </Stack>

          <Paper p="md" withBorder bg="var(--mantine-color-gray-0)">
            <Stack gap="xs">
              <Badge color="orange">Em breve</Badge>
              <Group>
                <IconTags size={16} color="var(--mantine-color-gray-6)" />
                <Text size="sm">ID: {product.publicId.slice(0, 8)}...</Text>
              </Group>
              <Group>
                <IconStar size={16} color="var(--mantine-color-yellow-6)" />
                <Text size="sm">Avaliação: 4.5/5 (23 avaliações)</Text>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </SimpleGrid>
    </Card>
  );
}
