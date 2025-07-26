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
import { useMediaQuery } from "@mantine/hooks";
import { IconShare, IconShoppingBag, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SizeGuideCard } from "./SizeChartCard/SizeChartCard";
import { Variation } from "./VariationImageGallery/Variation";

const product = {
  id: 1,
  publicId: "089e3d84-9b47-46c2-98aa-7b47889bdfa8",
  name: "T-shirt",
  active: true,
  createdAt: "2025-07-12T17:23:29.401Z",
  updatedAt: "2025-07-12T17:23:29.401Z",
  aggregations: {
    totalStock: 28,
    totalValue: 2800,
  },
  collection: {
    id: 1,
    publicId: "8caec05d-3b8e-4309-9868-71b033eb8cd5",
    name: "Pólen",
    active: true,
    description:
      "UM ENXAME DE CORPOS EM MOVIMENTO,\nMENTES FOCADAS E CORAÇÕES PULSANDO\nNO MESMO RITMO.",
    imageUrl:
      "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773897/beewear/banner-amarelo.png",
    createdAt: "2025-07-12T17:17:12.869Z",
    updatedAt: "2025-07-17T17:56:50.776Z",
    deletedAt: null,
  },
  variations: [
    {
      publicId: "b690d155-9140-4320-a965-ac8707bfc94e",
      color: "#005e32",
      name: "verde musgo",
      sizes: [
        {
          size: "XXS",
          stock: {
            id: 1,
            publicId: "a3406e3c-c714-440e-a4b3-8f171daaceaf",
            quantity: 3,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-17T18:16:45.624Z",
            deletedAt: null,
          },
        },
        {
          size: "XS",
          stock: {
            id: 2,
            publicId: "b5881228-d705-4e79-8750-944144d96b54",
            quantity: 10,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T19:58:45.540Z",
            deletedAt: null,
          },
        },
        {
          size: "S",
          stock: {
            id: 3,
            publicId: "72ddf7a1-a5cc-4952-9289-426be9a88c67",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "M",
          stock: {
            id: 4,
            publicId: "7fe07e9b-91f0-4383-9ceb-0060d5acd93e",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "L",
          stock: {
            id: 5,
            publicId: "bc4cafa4-ae9f-417d-8dbf-86300132d45f",
            quantity: 15,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T19:58:57.814Z",
            deletedAt: null,
          },
        },
        {
          size: "XL",
          stock: {
            id: 6,
            publicId: "6b49cb50-6335-4820-b682-45e635354ef6",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "XXL",
          stock: {
            id: 7,
            publicId: "8ba33635-b8da-4c4e-baa5-b4cf33539825",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
      ],
      images: [
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
      ],
      price: 100,
      stock: 28,
    },
    {
      publicId: "7aeae4a7-3154-49e3-99ca-801028016552",
      color: "#4f42ff",
      name: "azul",
      sizes: [
        {
          size: "XXS",
          stock: {
            id: 8,
            publicId: "d236a793-4ef3-42b8-b4a0-0e9740de22e8",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "XS",
          stock: {
            id: 9,
            publicId: "e185fbff-7376-45e4-93fc-982d3998567b",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "S",
          stock: {
            id: 10,
            publicId: "28da01f5-b877-4e2b-bfa0-fbd44391f5af",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "M",
          stock: {
            id: 11,
            publicId: "07c97d7b-bc41-4b06-9ec5-3d873ddbb4a2",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "L",
          stock: {
            id: 12,
            publicId: "039297b0-4b34-4ff5-8e20-a7d3e40f45d9",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "XL",
          stock: {
            id: 13,
            publicId: "c7d3a4b5-37d3-466e-b9e8-190140502ae3",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
        {
          size: "XXL",
          stock: {
            id: 14,
            publicId: "fdf06eea-5550-4841-8fa9-d66efb564664",
            quantity: 0,
            createdAt: "2025-07-12T17:23:29.401Z",
            updatedAt: "2025-07-12T17:23:29.401Z",
            deletedAt: null,
          },
        },
      ],
      images: [
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773760/beewear/blue2.jpg",
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775105/beewear/blue1.jpg",
      ],
      price: 100,
      stock: 28,
    },
  ],
};

export function ProductPreview() {
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
  }, []);

  const availableColors = product.variations.map((v: any) => ({
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
    <Center>
      <Card
        shadow="sm"
        padding={isMobile ? "md" : "lg"}
        radius="md"
        withBorder
        mt="md"
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* <VariationImageGallery
          selectedVariation={selectedVariation}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        /> */}

          <Variation
            key={selectedVariation.publicId} // <-- aqui
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
                €{selectedVariation?.price.toFixed(2).replace(".", ",")}
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
                  {availableColors.map((colorOption: any) => (
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
              >
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                color="blue"
                leftSection={<IconShare size={16} />}
                fullWidth
              >
                Compartilhar
              </Button>
            </Stack>

            <SizeGuideCard />
          </Stack>
        </SimpleGrid>
      </Card>
    </Center>
  );
}
