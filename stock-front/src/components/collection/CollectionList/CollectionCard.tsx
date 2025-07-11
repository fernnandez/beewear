import {
  Avatar,
  Badge,
  Button,
  Card,
  CardSection,
  Flex,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { getImage } from "@services/storage.service";
import { IconEye, IconPhoto } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@utils/formatDate";
import { getInitials } from "@utils/getInitials";
import { useNavigate } from "react-router-dom";
import type { Collection } from "src/types/collection";

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const navigate = useNavigate();

  const { data: src } = useQuery({
    queryKey: ["image", collection.imageUrl],
    queryFn: () => getImage(collection.imageUrl!),
    staleTime: 1000 * 60 * 5,
    enabled: !!collection.imageUrl,
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection>
        <Flex
          h={150}
          bg="var(--mantine-color-gray-1)"
          align="center"
          justify="center"
          direction="column"
          gap="xs"
        >
          {collection.imageUrl ? (
            <Image
              src={src}
              alt={collection.name}
              h={150}
              w="auto"
              fit="contain"
            />
          ) : (
            <>
              <Avatar size="xl" color="blue" variant="light">
                {getInitials(collection.name)}
              </Avatar>
              <Badge variant="light" color="gray" size="xs" mt={4}>
                <IconPhoto size={12} style={{ marginRight: 4 }} />
                Imagem em breve
              </Badge>
            </>
          )}
        </Flex>
      </CardSection>

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
        <Badge color={collection.active ? "green" : "red"}>
          {collection.active ? "Ativa" : "Inativa"}
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
  );
};
