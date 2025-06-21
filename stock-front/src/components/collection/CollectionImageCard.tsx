import {
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { getInitials } from "@utils/getInitials";

export function CollectionImageCard({
  collectionName,
}: {
  collectionName: string;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <IconPhoto size={18} />
          <Title order={4}>Imagem da Coleção</Title>
          <Badge color="orange" size="sm">
            Em breve
          </Badge>
        </Group>
      </Card.Section>

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
    </Card>
  );
}
