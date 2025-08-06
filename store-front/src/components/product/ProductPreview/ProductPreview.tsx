import { useCart } from "@contexts/cart-context";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconShare, IconShoppingBag, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Product, ProductVariationSize } from "../../../types/product";
import { formatPrice } from "../../../utils/formatPrice";
import { SizeGuideCard } from "./SizeChartCard/SizeChartCard";
import { Variation } from "./VariationImageGallery/Variation";

interface ProductPreviewProps {
  product: Product;
}

export function ProductPreview({ product }: ProductPreviewProps) {
  const { addItem } = useCart();
  const clipboard = useClipboard({ timeout: 500 });

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");

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
  }, [product]);

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

  const handleSizeChange = (size: ProductVariationSize) => {
    setSelectedSize(size);
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    clipboard.copy(currentUrl);

    notifications.show({
      title: "Link copiado!",
      message: "O link da página foi copiado para a área de transferência.",
      color: "green",
    });
  };

  return (
    <Center>
      <Card
        shadow="sm"
        padding={isMobile ? "md" : "lg"}
        radius="md"
        withBorder
        mt="md"
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Variation
            key={selectedVariation.publicId}
            selectedVariation={selectedVariation}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />

          {/* Info do produto */}
          <Stack>
            <div>
              <Badge variant="light" color={isDark ? "white" : "dark"}>
                {product.collection?.name || "Sem coleção"}
              </Badge>
              <Title order={3} mb="xs">
                {product.name}
              </Title>
            </div>

            <Group>
              <Title order={1} fw={400}>
                {formatPrice(selectedVariation?.price)}
              </Title>
              {selectedSize?.stock.quantity <= 5 &&
                selectedSize?.stock.quantity > 0 && (
                  <Badge size="sm" color="yellow">
                    Últimas unidades
                  </Badge>
                )}
            </Group>

            {/* Cor */}
            {availableColors.length > 1 && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Cor:{" "}
                  <Text span c="dimmed">
                    {selectedVariation.name}
                  </Text>
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
                          selectedVariation.publicId === colorOption.publicId
                            ? isDark
                              ? "3px solid var(--mantine-color-white)" // borda destaque no dark mode
                              : "3px solid var(--mantine-color-dark-6)" // borda destaque no light mode
                            : isDark
                            ? "2px solid var(--mantine-color-dark-6)" // borda padrão no dark
                            : "2px solid var(--mantine-color-gray-3)", // borda padrão no light
                        cursor: "pointer",
                      }}
                      onClick={() => handleColorChange(colorOption.publicId)}
                    />
                  ))}
                </Group>
              </div>
            )}

            {/* Tamanho */}
            {availableSizes.length > 1 && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Tamanho:{" "}
                  <Text span c="dimmed">
                    {selectedSize?.size}
                  </Text>
                </Text>
                <Flex wrap="wrap" gap="xs">
                  {availableSizes.map((sizeOption) => {
                    const isAvailable = sizeOption.stock.quantity > 0;
                    const isSelected = selectedSize?.size === sizeOption.size;

                    return (
                      <Button
                        key={sizeOption.size}
                        variant={isSelected ? "filled" : "outline"}
                        size="sm"
                        disabled={!isAvailable}
                        onClick={() => handleSizeChange(sizeOption)}
                        color="gray"
                        styles={(theme) => ({
                          root: {
                            backgroundColor: isSelected
                              ? isDark
                                ? theme.colors.yellow[5] // amarelo no dark
                                : theme.colors.yellow[5] // amarelo mais escuro no light
                              : isDark
                              ? theme.colors.dark[7] // fundo padrão dark
                              : theme.white, // fundo padrão light
                            color: !isAvailable
                              ? theme.colors.gray[5]
                              : isSelected
                              ? theme.black
                              : isDark
                              ? theme.colors.gray[2]
                              : theme.black,
                            borderColor: !isAvailable
                              ? "transparent" // sem borda se não disponível
                              : isSelected
                              ? "transparent"
                              : theme.colors.gray[4],
                          },
                        })}
                      >
                        {sizeOption.size}
                      </Button>
                    );
                  })}
                </Flex>
              </div>
            )}

            {/* Estoque */}
            <Group>
              {selectedSize?.stock.quantity <= 0 && (
                <Text size="sm" c="dimmed">
                  <IconX
                    size={16}
                    color="var(--mantine-color-red-6)"
                    style={{ marginRight: 4 }}
                  />
                  Fora de estoque
                </Text>
              )}
            </Group>

            {/* Ações */}
            <Stack gap="sm">
              <Button
                color="dark"
                leftSection={<IconShoppingBag size={16} />}
                disabled={!selectedSize || selectedSize.stock.quantity === 0}
                size="md"
                fullWidth={isMobile}
                onClick={() => {
                  addItem({
                    name: product.name,
                    publicId: selectedSize.publicId,
                    color: selectedVariation.color,
                    price: selectedVariation.price,
                    image: selectedVariation.images[0],
                    size: selectedSize.size,
                  });
                }}
              >
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                color="blue"
                leftSection={<IconShare size={16} />}
                fullWidth
                onClick={handleShare}
              >
                {clipboard.copied ? "Link copiado!" : "Compartilhar"}
              </Button>
            </Stack>

            <SizeGuideCard />
          </Stack>
        </SimpleGrid>
      </Card>
    </Center>
  );
}
