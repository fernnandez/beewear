import { Button, Card, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { updateCollectionStatus } from "@services/collection.service";
import { IconToggleLeft, IconToggleRight } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StatusConfirmationModal } from "./StatusConfirmationModal";

type Props = {
  name: string;
  publicId: string;
  isActive: boolean;
  isEditingInfo: boolean;
};

export const CollectionStatus = ({
  name,
  publicId,
  isActive,
  isEditingInfo,
}: Props) => {
  const [pendingStatusChange, setPendingStatusChange] = useState(false);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const queryClient = useQueryClient();

  const handleRequestStatusToggle = () => {
    setPendingStatusChange(!isActive);
    openModal();
  };

  const mutation = useMutation({
    mutationFn: (newStatus: boolean) =>
      updateCollectionStatus(publicId, newStatus),
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries({
        queryKey: ["collection-details", publicId],
      });

      notifications.show({
        title: newStatus ? "Coleção ativada" : "Coleção desativada",
        message: newStatus
          ? "A coleção está agora visível nas listagens"
          : "A coleção foi ocultada das listagens públicas",
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
      <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
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
              <Title order={4}>Status da Coleção</Title>
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
              disabled={isEditingInfo}
            >
              {isActive ? "Desativar" : "Ativar"}
            </Button>
          </Group>
        </Card.Section>

        <Group justify="space-between" align="center">
          <div>
            <Text fw={500} mb={4}>
              Coleção {isActive ? "Ativa" : "Inativa"}
            </Text>
            <Text size="sm" c="dimmed">
              {isActive
                ? "Esta coleção está visível nas listagens públicas e pode receber novos produtos."
                : "Esta coleção está oculta das listagens públicas. Os produtos existentes permanecem ativos."}
            </Text>
            {isEditingInfo && (
              <Text size="xs" c="orange" mt="xs">
                Termine de editar as informações antes de alterar o status.
              </Text>
            )}
          </div>
        </Group>
      </Card>

      {/* Modal de confirmação */}
      <StatusConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleToggleStatus}
        collectionName={name}
        pendingStatus={pendingStatusChange}
      />
    </>
  );
};
