import { Button, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconToggleLeft,
  IconToggleRight,
} from "@tabler/icons-react";

interface ProductStatusConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  pendingStatus: boolean;
}

export function ProductStatusConfirmationModal({
  opened,
  onClose,
  onConfirm,
  productName,
  pendingStatus,
}: ProductStatusConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={pendingStatus ? "Ativar Produto" : "Desativar Produto"}
      centered
    >
      <Stack>
        <Group>
          <IconAlertTriangle
            size={24}
            color={
              pendingStatus
                ? "var(--mantine-color-green-6)"
                : "var(--mantine-color-orange-6)"
            }
          />
          <div>
            <Text fw={500}>
              {pendingStatus ? "Ativar" : "Desativar"} o produto "
              {productName}"?
            </Text>
            <Text size="sm" c="dimmed">
              {pendingStatus
                ? "O produto ficará visível nas listagens públicas e poderá receber novos produtos."
                : "O produto será ocultada das listagens públicas, mas os produtos existentes permanecerão ativos."}
            </Text>
          </div>
        </Group>

        <Paper
          p="md"
          withBorder
          bg={
            pendingStatus
              ? "var(--mantine-color-green-0)"
              : "var(--mantine-color-orange-0)"
          }
        >
          <Group>
            {pendingStatus ? (
              <IconToggleRight size={20} color="var(--mantine-color-green-6)" />
            ) : (
              <IconToggleLeft size={20} color="var(--mantine-color-orange-6)" />
            )}
            <div>
              <Text size="sm" fw={500}>
                Status: {pendingStatus ? "Ativo" : "Inativo"}
              </Text>
              <Text size="xs" c="dimmed">
                {pendingStatus ? "Visível publicamente" : "Oculta do público"}
              </Text>
            </div>
          </Group>
        </Paper>

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            color={pendingStatus ? "green" : "orange"}
            leftSection={
              pendingStatus ? (
                <IconToggleRight size={16} />
              ) : (
                <IconToggleLeft size={16} />
              )
            }
            onClick={onConfirm}
          >
            {pendingStatus ? "Ativar Coleção" : "Desativar Coleção"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
