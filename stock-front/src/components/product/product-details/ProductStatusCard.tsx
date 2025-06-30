import { Button, Card, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { updateProductStatus } from "@services/product.service";
import { IconToggleLeft, IconToggleRight } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProductStatusConfirmationModal } from "./ProductStatusConfirmationModal";

export function ProductStatusCard({
  name,
  publicId,
  isActive,
  isEditing,
}: {
  name: string;
  publicId: string;
  isActive: boolean;
  isEditing: boolean;
}) {
  const queryClient = useQueryClient();
  const [pendingStatusChange, setPendingStatusChange] = useState(false);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const handleRequestStatusToggle = () => {
    setPendingStatusChange(!isActive);
    openModal();
  };

  const mutation = useMutation({
    mutationFn: (newStatus: boolean) =>
      updateProductStatus(publicId, newStatus),
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries({
        queryKey: ["product-details", publicId],
      });

      notifications.show({
        title: newStatus ? "Produto ativado" : "Produto desativado",
        message: newStatus
          ? "O Produto está agora visível nas listagens"
          : "O Produto foi ocultada das listagens públicas",
        color: newStatus ? "green" : "orange",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro ao atualizar status",
        message: "Tente novamente mais tarde.",
        color: "red",
      });
    },
  });

  const handleToggleStatus = () => {
    mutation.mutate(!isActive);
    closeModal();
  };
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <Group>
              {isActive ? (
                <IconToggleRight
                  size={18}
                  color="var(--mantine-color-green-6)"
                />
              ) : (
                <IconToggleLeft size={18} color="var(--mantine-color-red-6)" />
              )}
              <Title order={4}>Status do Produto</Title>
            </Group>
            <Button
              size="sm"
              variant={isActive ? "light" : "filled"}
              color={isActive ? "orange" : "green"}
              leftSection={
                isActive ? (
                  <IconToggleRight size={14} />
                ) : (
                  <IconToggleLeft size={14} />
                )
              }
              onClick={handleRequestStatusToggle}
              loading={mutation.isPending}
              disabled={isEditing}
            >
              {isActive ? "Desativar" : "Ativar"}
            </Button>
          </Group>
        </Card.Section>

        <Group justify="space-between" align="center">
          <div>
            <Text fw={500} mb={4}>
              Produto {isActive ? "Ativo" : "Inativo"}
            </Text>
            <Text size="sm" c="dimmed">
              {isActive
                ? "Este produto está visível na loja e disponível para venda."
                : "Este produto está oculto da loja. As variações ativas ainda podem ser vendidas diretamente."}
            </Text>
            {isEditing && (
              <Text size="xs" c="orange" mt="xs">
                Termine de editar as informações antes de alterar o status.
              </Text>
            )}
          </div>
        </Group>
      </Card>

      <ProductStatusConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleToggleStatus}
        productName={name}
        pendingStatus={pendingStatusChange}
      />
    </>
  );
}
