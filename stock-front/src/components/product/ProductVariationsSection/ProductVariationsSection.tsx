import { Button, Card, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { NewVariationModal } from "./NewVariationModal";
import { ProductVariationSectionCard } from "./ProductVariationSectionCard";
import { ProductVariationSize } from "@localTypes/product";

// TODO: analisar essas interfaces
export interface Variation {
  publicId: string;
  name: string;
  color: string;
  price: number;
  sizes: ProductVariationSize[];
  images?: string[] | null;
}


interface ProductVariationsCardProps {
  productPublicId: string;
  variations: Variation[];
}

export function ProductVariationsSection({
  productPublicId,
  variations,
}: ProductVariationsCardProps) {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <div>
              <Title order={4}>Variações do Produto</Title>
              <Text size="sm" c="dimmed">
                Diferentes cores e tamanhos disponíveis
              </Text>
            </div>
            <Button
              size="sm"
              leftSection={<IconPlus size={14} />}
              onClick={openModal}
            >
              Nova Variação
            </Button>
          </Group>
        </Card.Section>

        {variations.length > 0 ? (
          <Stack gap="md">
            {variations.map((variation) => (
              <ProductVariationSectionCard
                key={variation.publicId}
                productPublicId={productPublicId}
                variation={variation}
              />
            ))}
          </Stack>
        ) : (
          <Paper p="xl" withBorder>
            <Group align="center" gap="md">
              <Text c="dimmed" size="lg">
                Nenhuma variação cadastrada
              </Text>
              <Button variant="light" leftSection={<IconPlus size={16} />}>
                Adicionar Primeira Variação
              </Button>
            </Group>
          </Paper>
        )}
      </Card>

      <NewVariationModal
        opened={modalOpened}
        onClose={closeModal}
        productPublicId={productPublicId}
      />
    </>
  );
}
