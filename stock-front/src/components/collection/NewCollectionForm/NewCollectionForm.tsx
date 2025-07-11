import {
  Badge,
  Button,
  Card,
  Divider,
  FileInput,
  Flex,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { createCollection } from "@services/collection.service";
import { IconCheck, IconInfoCircle, IconPhoto } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { CollectionPreview } from "../CollectionPreview/CollectionPreview";

interface FormValues {
  name: string;
  description: string;
  active: boolean;
  imageFile: File | null;
}

export const NewCollectionForm = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      description: "",
      active: false,
      imageFile: null,
    },
    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
    },
  });

  const handleSubmit = async () => {
    const isValid = form.validate();
    if (isValid.hasErrors) {
      notifications.show({
        title: "Erro no formulário",
        message: "Por favor, preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    await createCollection({
      name: form.values.name,
      description: form.values.description,
      active: form.values.active,
      imageFile: form.values.imageFile,
    });

    notifications.show({
      title: "Coleção criada",
      message: `Coleção "${form.values.name}" criada com sucesso.`,
      color: "green",
    });

    navigate("/collections");
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction="column" gap="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconInfoCircle size={18} />
              <Title order={4}>Informações da Coleção</Title>
            </Group>
            <Text size="sm" c="dimmed">
              Dados principais da coleção
            </Text>
          </Card.Section>

          <Stack mb="md">
            <TextInput
              label="Nome da Coleção"
              placeholder="Ex: Verão 2024"
              {...form.getInputProps("name")}
              withAsterisk
            />
            <Textarea
              label="Descrição"
              placeholder="Descreva o conceito..."
              {...form.getInputProps("description")}
              minRows={2}
            />
            <Stack gap={4} justify="center">
              <Text size="sm" fw={500}>
                Coleção ativa
              </Text>
              <Switch {...form.getInputProps("active", { type: "checkbox" })} />
            </Stack>
          </Stack>

          <Divider />

          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPhoto size={18} />
              <Title order={4}>Imagem da Coleção</Title>
              <Badge color="orange" size="sm">
                Em breve
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Adicione uma imagem representativa da coleção
            </Text>
          </Card.Section>

          <Stack>
            <FileInput
              label="Capa da coleção"
              description="Imagem da coleção exibida como banner"
              accept="image/*"
              {...form.getInputProps("imageFile")}
              clearable
            />
          </Stack>
        </Card>

        {(form.values.name || form.values.description) && (
          <CollectionPreview
            name={form.values.name}
            description={form.values.description}
            file={form.values.imageFile}
          />
        )}

        <Group justify="flex-end">
          <Button
            type="submit"
            leftSection={<IconCheck size={16} />}
            disabled={!form.values.name}
          >
            Criar Coleção
          </Button>
        </Group>
      </Flex>
    </form>
  );
};
