"use client";

import { AppShellLayout } from "@components/AppShell";
import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { createCollection } from "@services/collection.service";
import {
  IconArrowBackUp,
  IconCheck,
  IconInfoCircle,
  IconPhoto,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function NewCollectionPage() {
  const form = useForm<{
    name: string;
    description: string;
    file: File | null;
  }>({
    initialValues: {
      name: "",
      description: "",
      file: null,
    },
    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
    },
  });

  const handleSubmit = async () => {
    const isValid = form.validate();

    if (isValid.hasErrors) {
      console.warn("Formulário com erros:", isValid.errors);
      notifications.show({
        title: "Erro no formulário",
        message: "Por favor, preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    await createCollection(form.values);

    console.log("Dados do formulário:", {
      ...form.values,
    });

    notifications.show({
      title: "Coleção válida",
      message: `A coleção "${form.values.name}" foi preenchido corretamente.`,
      color: "green",
    });

    // navigate("/collection");
  };

  return (
    <AppShellLayout>
      <Container size="md">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Nova Coleção</Title>
            <Text c="dimmed">
              Crie uma nova coleção para organizar seus produtos
            </Text>
          </div>
          <Button
            variant="light"
            component={Link}
            to="/collections"
            leftSection={<IconArrowBackUp size={16} />}
          >
            Coleções
          </Button>
        </Group>

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
                  placeholder="Ex: Verão 2024, Inverno Elegante..."
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  withAsterisk
                  description="Nome que identificará sua coleção"
                />

                <Textarea
                  label="Descrição"
                  placeholder="Descreva o conceito, estilo e características desta coleção..."
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  minRows={2}
                  description="Descrição detalhada da coleção e seu conceito"
                />
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
                  description="Imagem capa da coleção a ser exibida como banner na loja"
                  placeholder="Selecione uma imagem"
                  accept="image/*"
                  key={form.key("file")}
                  {...form.getInputProps("file")}
                  clearable
                />
              </Stack>
            </Card>

            {(form.getValues().name || form.getValues().description) && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                  <Title order={4}>Preview da Coleção</Title>
                  <Text size="sm" c="dimmed">
                    Veja como sua coleção aparecerá
                  </Text>
                </Card.Section>

                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Card.Section>
                    <Flex
                      h={200}
                      bg="var(--mantine-color-gray-1)"
                      align="center"
                      justify="center"
                      direction="column"
                      gap="xs"
                    >
                      {form.values.file ? (
                        <Image
                          src={URL.createObjectURL(form.values.file)}
                          alt="Pré-visualização da imagem"
                          radius="md"
                          fit="contain"
                          maw={240}
                        />
                      ) : (
                        <>
                          <IconPhoto
                            size={32}
                            color="var(--mantine-color-blue-6)"
                          />
                          <Badge variant="light" color="gray" size="xs">
                            <IconPhoto size={12} style={{ marginRight: 4 }} />
                            Imagem em breve
                          </Badge>
                        </>
                      )}
                    </Flex>
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Title order={5}>
                      {form.getValues().name || "Nome da Coleção"}
                    </Title>
                    <Badge variant="light" color="blue">
                      Nova
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {form.getValues().description ||
                      "Descrição da coleção aparecerá aqui..."}
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
      </Container>
    </AppShellLayout>
  );
}
