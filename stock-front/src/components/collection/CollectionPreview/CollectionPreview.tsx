import { ImagePreview } from "@components/shared/ImagePreview/ImagePreview";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { IconEdit, IconPhoto } from "@tabler/icons-react";

export const CollectionPreview = ({
  name,
  description,
  file,
  image,
}: {
  name?: string;
  description?: string;
  file?: File | null;
  image?: string | null;
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group justify="space-between">
          <Group>
            <IconPhoto size={18} />
            <Title order={4}>Preview da Coleção</Title>
            <Text size="sm" c="dimmed">
              Veja como sua coleção aparecerá
            </Text>
          </Group>

          {image && (
            <ActionIcon variant="subtle">
              <IconEdit size={22} />
            </ActionIcon>
          )}
        </Group>
      </Card.Section>

      <Card padding="md" radius="md" withBorder>
        <Card.Section>
          <Flex
            h={500}
            align="center"
            justify="center"
            direction="column"
            gap="xs"
            style={{ backgroundColor: "var(--mantine-color-gray-1)" }}
          >
            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="Prévia"
                h={450}
                w="auto"
                fit="contain"
              />
            ) : image ? (
              <ImagePreview image={image} h={450} w="auto" fit="contain" />
            ) : (
              <>
                <IconPhoto size={32} color="var(--mantine-color-blue-6)" />
                <Badge variant="light" color="gray" size="sm">
                  Nenhuma imagem selecionada
                </Badge>
              </>
            )}
          </Flex>
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Title order={5}>{name || "Nome da Coleção"}</Title>
          <Badge variant="light" color="blue">
            Nova
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {description || "Descrição da coleção aparecerá aqui..."}
        </Text>
      </Card>
    </Card>
  );
};
