import {
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconToggleLeft,
  IconToggleRight,
} from "@tabler/icons-react";

interface StatusConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collectionName: string;
  pendingStatus: boolean;
}

export function StatusConfirmationModal({
  opened,
  onClose,
  onConfirm,
  collectionName,
  pendingStatus,
}: StatusConfirmationModalProps) {
  const { colorScheme } = useMantineColorScheme();

  const paperBg = pendingStatus
    ? colorScheme === "dark"
      ? "dark.6"
      : "green.0"
    : colorScheme === "dark"
    ? "dark.6"
    : "orange.0";

  const iconColor = pendingStatus ? "green.6" : "orange.6";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={pendingStatus ? "Ativar Coleção" : "Desativar Coleção"}
      centered
    >
      <Stack>
        <Group>
          <IconAlertTriangle
            size={24}
            color={`var(--mantine-color-${iconColor})`}
          />
          <div>
            <Text fw={500}>
              {pendingStatus ? "Ativar" : "Desativar"} a coleção "
              {collectionName}"?
            </Text>
            <Text size="sm" c="dimmed">
              {pendingStatus
                ? "A coleção ficará visível nas listagens públicas e poderá receber novos produtos."
                : "A coleção será ocultada das listagens públicas, mas os produtos existentes permanecerão ativos."}
            </Text>
          </div>
        </Group>

        <Paper p="md" withBorder bg={paperBg}>
          <Group>
            {pendingStatus ? (
              <IconToggleRight
                size={20}
                color={`var(--mantine-color-green-6)`}
              />
            ) : (
              <IconToggleLeft
                size={20}
                color={`var(--mantine-color-orange-6)`}
              />
            )}
            <div>
              <Text size="sm" fw={500}>
                Status: {pendingStatus ? "Ativa" : "Inativa"}
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
