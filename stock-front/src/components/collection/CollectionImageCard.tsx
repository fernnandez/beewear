import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { getImage } from "@services/storage.service";
import { IconEdit, IconPhoto } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getInitials } from "@utils/getInitials";

export function CollectionImageCard({
  collectionName,
  collectionImageUrl,
}: {
  collectionName: string;
  collectionImageUrl: string | null;
}) {
  const { data: src } = useQuery({
    queryKey: ["image", collectionImageUrl],
    queryFn: () => getImage(collectionImageUrl!),
    staleTime: 1000 * 60 * 5,
    enabled: !!collectionImageUrl,
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group justify="space-between">
          <Group>
            <IconPhoto size={18} />
            <Title order={4}>Imagem da Coleção</Title>
            <Badge color="orange" size="sm">
              Em breve
            </Badge>
          </Group>

          <ActionIcon variant="subtle">
            <IconEdit size={22} />
          </ActionIcon>
        </Group>
      </Card.Section>

      {collectionImageUrl ? (
        <Image src={src} alt={collectionName} h={400} w="auto" fit="contain" />
      ) : (
        <>
          <Paper p="xl" withBorder bg="var(--mantine-color-gray-0)">
            <Flex direction="column" align="center" gap="md">
              <Avatar size="xl" color="blue" variant="light">
                {getInitials(collectionName)}
              </Avatar>
              <Text c="dimmed" ta="center">
                Nenhuma imagem definida
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                A funcionalidade de upload estará disponível em breve
              </Text>
            </Flex>
          </Paper>
        </>
      )}
    </Card>
  );
}
