import { SaveConfirmationModal } from "@components/collection";
import { ProductDetails } from "@localTypes/product";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { updateProduct } from "@services/product.service";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconEdit,
  IconFolder,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@utils/formatDate";
import { getInitials } from "@utils/getInitials";

type FormValues = {
  name: string;
};

interface ProductInfoCardProps {
  product: ProductDetails;
  form: UseFormReturnType<FormValues>;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function ProductInfoCard({
  product,
  isEditing,
  form,
  onStartEdit,
  onCancelEdit,
}: ProductInfoCardProps) {
  const queryClient = useQueryClient();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const mutation = useMutation({
    mutationFn: (formValues: FormValues) =>
      updateProduct(product.publicId, {
        name: formValues.name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-details", product.publicId],
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
              <Title order={4}>Informações do Produto</Title>
              <Badge color={product.active ? "green" : "red"} variant="light">
                {product.active ? "Ativo" : "Inativo"}
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
              label="Nome do Produto"
              {...form.getInputProps("name")}
              value={form.values.name}
              required
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
            <Group>
              <Avatar color="blue" radius="sm" size="lg">
                {getInitials(product?.name || "")}
              </Avatar>
              <div>
                <Title order={3}>{product?.name}</Title>
                <Text size="sm" c="dimmed">
                  ID: {product?.publicId.slice(0, 8)}...
                </Text>
              </div>
            </Group>

            {/* Coleção */}
            {product?.collection && (
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={4}>
                  Coleção
                </Text>
                <Group>
                  <IconFolder size={16} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text fw={500}>{product.collection.name}</Text>
                    <Text size="xs" c="dimmed">
                      {product.collection.description}
                    </Text>
                  </div>
                </Group>
              </div>
            )}

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={4}>
                  Criado em
                </Text>
                <Group gap="xs">
                  <IconCalendar size={16} color="var(--mantine-color-gray-6)" />
                  <Text size="sm">{formatDate(product.createdAt)}</Text>
                </Group>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={4}>
                  Última atualização
                </Text>
                <Group gap="xs">
                  <IconEdit size={16} color="var(--mantine-color-gray-6)" />
                  <Text size="sm">{formatDate(product.updatedAt)}</Text>
                </Group>
              </div>
            </SimpleGrid>
          </Stack>
        )}
      </Card>
      <SaveConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleConfirmSave}
        originalData={{
          name: product.name,
        }}
        editData={{
          name: form.values.name,
        }}
      />
    </>
  );
}
