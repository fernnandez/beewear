import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { updateCollection } from "@services/collection.service";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconEdit,
  IconFolder,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@utils/formatDate";
import type { CollectionDetails } from "src/types/collection";
import { SaveConfirmationModal } from "./SaveConfirmationModal";

type FormValues = {
  name: string;
  description: string;
};

type CollectionInfoCardProps = {
  collection: CollectionDetails;
  form: UseFormReturnType<FormValues>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

export const CollectionInfoCard = ({
  collection,
  isEditing,
  form,
  onStartEdit,
  onCancelEdit,
}: CollectionInfoCardProps) => {
  const queryClient = useQueryClient();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const mutation = useMutation({
    mutationFn: (formValues: FormValues) =>
      updateCollection(collection.publicId, {
        name: formValues.name,
        description: formValues.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection-details", collection.publicId],
      });

      onCancelEdit();
      closeModal();

      notifications.show({
        title: "Coleção atualizada",
        message: "As informações foram salvas com sucesso.",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro ao atualizar",
        message: "Não foi possível salvar as alterações. Tente novamente.",
        color: "red",
      });
    },
  });

  const handleConfirmSave = () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      notifications.show({
        title: "Erro no formulário",
        message: "Por favor, preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    mutation.mutate(form.values);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <Group>
              <IconFolder size={18} />
              <Title order={4}>Informações da Coleção</Title>
              <Badge
                color={collection.active ? "green" : "red"}
                variant="light"
              >
                {collection.active ? "Ativa" : "Inativa"}
              </Badge>
            </Group>
            {!isEditing && (
              <ActionIcon variant="subtle" onClick={onStartEdit}>
                <IconEdit size={22} />
              </ActionIcon>
            )}
          </Group>
        </Card.Section>

        {isEditing ? (
          <Stack>
            <TextInput
              label="Nome da Coleção"
              {...form.getInputProps("name")}
              value={form.values.name}
              withAsterisk
              autoFocus
            />
            <Textarea
              label="Descrição"
              {...form.getInputProps("description")}
              value={form.values.description}
              minRows={2}
            />
            <Group justify="flex-end" mt="sm">
              <Button variant="outline" size="sm" onClick={onCancelEdit}>
                Cancelar
              </Button>
              <Button
                size="sm"
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={openModal}
              >
                Salvar
              </Button>
            </Group>
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
                  <IconCalendar size={16} color="var(--mantine-color-gray-6)" />
                  <Text size="sm">{formatDate(collection.createdAt)}</Text>
                </Group>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={4}>
                  Última atualização
                </Text>
                <Group gap="xs">
                  <IconEdit size={16} color="var(--mantine-color-gray-6)" />
                  <Text size="sm">{formatDate(collection.updatedAt)}</Text>
                </Group>
              </div>
            </SimpleGrid>
          </Stack>
        )}
      </Card>

      {/* Modal de confirmação */}

      <SaveConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleConfirmSave}
        originalData={{
          name: collection.name,
          description: collection?.description,
        }}
        editData={{
          name: form.values.name,
          description: form.values?.description,
        }}
      />
    </>
  );
};
