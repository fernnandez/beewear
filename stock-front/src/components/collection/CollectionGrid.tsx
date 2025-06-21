import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { IconEye, IconPhoto, IconSection } from "@tabler/icons-react";
import { formatDate } from "@utils/formatDate";
import { getInitials } from "@utils/getInitials";
import { useNavigate } from "react-router-dom";
import type { Collection } from "src/types/collection";

interface Props {
  collections: Collection[];
}

export const CollectionGrid = ({ collections }: Props) => {
  const navigate = useNavigate();

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
          <Card
            key={collection.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Card.Section>
              <Group
                h={120}
                bg="var(--mantine-color-gray-1)"
                align="center"
                justify="center"
              >
                <Avatar size="xl" color="blue" variant="light">
                  {collection.imageUrl ? (
                    <img
                      src={collection.imageUrl || "/placeholder.svg"}
                      alt={collection.name}
                    />
                  ) : (
                    getInitials(collection.name)
                  )}
                </Avatar>
                <Badge variant="light" color="gray" size="xs">
                  <IconPhoto size={12} style={{ marginRight: 4 }} />
                  Imagem em breve
                </Badge>
              </Group>
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Title order={5}>{collection.name}</Title>
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2} mb="md">
              {collection.description}
            </Text>

            <Group justify="space-between" mb="md">
              <Text size="xs" c="dimmed">
                Criada em {formatDate(collection.createdAt)}
              </Text>
              <Badge variant="light" color="blue">
                Ativa
              </Badge>
            </Group>

            <Button
              variant="light"
              fullWidth
              leftSection={<IconEye size={14} />}
              onClick={() => navigate(`/collections/${collection.publicId}`)}
            >
              Ver Detalhes
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
};
