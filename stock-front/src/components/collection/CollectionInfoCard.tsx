import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconCalendar, IconEdit, IconFolder } from "@tabler/icons-react";
import { formatDate } from "@utils/formatDate";
import type { CollectionDetails } from "src/types/collection";

type FormValues = {
  name: string;
  description: string;
  isActive: boolean;
};

type Props = {
  isEditing: boolean;
  collection: CollectionDetails;
  form: UseFormReturnType<FormValues>;
};

export function CollectionInfoCard({ isEditing, collection, form }: Props) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <IconFolder size={18} />
          <Title order={4}>Informações da Coleção</Title>
          {!isEditing && (
            <Badge color={collection.active ? "green" : "red"}>
              {collection.active ? "Ativa" : "Inativa"}
            </Badge>
          )}
        </Group>
      </Card.Section>

      {isEditing ? (
        <Stack>
          <TextInput
            label="Nome da Coleção"
            {...form.getInputProps("name")}
            required
          />
          <Textarea
            label="Descrição"
            {...form.getInputProps("description")}
            minRows={4}
            required
          />
          <Switch
            label="Coleção ativa"
            description="Coleções inativas não aparecem nas listagens públicas"
            {...form.getInputProps("isActive", { type: "checkbox" })}
          />
        </Stack>
      ) : (
        <Stack>
          <div>
            <Text size="sm" fw={500} c="dimmed" mb={4}>
              Nome
            </Text>
            <Title order={3}>{collection.name}</Title>
          </div>
          <div>
            <Text size="sm" fw={500} c="dimmed" mb={4}>
              Descrição
            </Text>
            <Text>{collection.description}</Text>
          </div>
          <SimpleGrid cols={2}>
            <div>
              <Text size="sm" fw={500} c="dimmed" mb={4}>
                Criada em
              </Text>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{formatDate(collection.createdAt)}</Text>
              </Group>
            </div>
            <div>
              <Text size="sm" fw={500} c="dimmed" mb={4}>
                Atualizada em
              </Text>
              <Group gap="xs">
                <IconEdit size={16} />
                <Text size="sm">{formatDate(collection.updatedAt)}</Text>
              </Group>
            </div>
          </SimpleGrid>
        </Stack>
      )}
    </Card>
  );
}
