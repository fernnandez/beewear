import { Badge, Card, Flex, Group, Image, Text, Title } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

export function CollectionPreview({
  name,
  description,
  file,
}: {
  name?: string;
  description?: string;
  file?: File | null;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Title order={4}>Preview da Coleção</Title>
        <Text size="sm" c="dimmed">
          Veja como sua coleção aparecerá
        </Text>
      </Card.Section>

      <Card padding="md" radius="md" withBorder>
        <Card.Section>
          <Flex
            h={200}
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
                fit="contain"
                maw={240}
              />
            ) : (
              <>
                <IconPhoto size={32} color="var(--mantine-color-blue-6)" />
                <Badge variant="light" color="gray" size="xs">
                  <IconPhoto size={12} style={{ marginRight: 4 }} /> Imagem em
                  breve
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

        <Group justify="space-between" mt="md">
          <Text size="sm" fw={500}>
            0 produtos
          </Text>
          <Text size="xs" c="dimmed">
            Criada hoje
          </Text>
        </Group>
      </Card>
    </Card>
  );
}
