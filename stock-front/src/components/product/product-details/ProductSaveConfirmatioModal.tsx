import { Button, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

interface ProductSaveConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  originalData: { name: string; description?: string };
  editData: { name: string; description?: string };
}

export function ProductSaveConfirmationModal({
  opened,
  onClose,
  onConfirm,
  originalData,
  editData,
}: ProductSaveConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirmar Alterações"
      centered
    >
      <Stack>
        <Group>
          <IconAlertTriangle size={24} color="var(--mantine-color-blue-6)" />
          <div>
            <Text fw={500}>Salvar alterações no produto ?</Text>
            <Text size="sm" c="dimmed">
              As seguintes informações serão atualizadas:
            </Text>
          </div>
        </Group>

        <Paper p="md" withBorder bg="var(--mantine-color-blue-0)">
          <Stack gap="xs">
            {editData.name !== originalData.name && (
              <div>
                <Text size="sm" fw={500}>
                  Nome:
                </Text>
                <Text size="sm" c="dimmed">
                  "{originalData.name}" → "{editData.name}"
                </Text>
              </div>
            )}
          </Stack>
        </Paper>

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button leftSection={<IconCheck size={16} />} onClick={onConfirm}>
            Confirmar e Salvar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
