import { Card, Group, SimpleGrid, Title } from "@mantine/core";
import { IconSection } from "@tabler/icons-react";
import type { Collection } from "src/types/collection";
import { CollectionCard } from "./CollectionCard";

interface Props {
  collections: Collection[];
}

export const CollectionGrid = ({ collections }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <IconSection size={18} />
          <Title order={4}>Suas Coleções ({collections.length})</Title>
        </Group>
      </Card.Section>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {collections.map((collection) => (
          <>
            <CollectionCard collection={collection} />
          </>
        ))}
      </SimpleGrid>
    </Card>
  );
};
