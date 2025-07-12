import {
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

interface SaveConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  originalData: { name: string; description?: string };
  editData: { name: string; description?: string };
}

export function SaveConfirmationModal({
  opened,
  onClose,
  onConfirm,
  originalData,
  editData,
}: SaveConfirmationModalProps) {
  const { colorScheme } = useMantineColorScheme();

  const paperBg = colorScheme === "dark" ? "dark.6" : "blue.0";

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
            <Text fw={500}>Salvar alterações na coleção?</Text>
            <Text size="sm" c="dimmed">
              As seguintes informações serão atualizadas:
            </Text>
          </div>
        </Group>

        <Paper p="md" withBorder bg={paperBg}>
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
            {editData.description !== originalData.description && (
              <div>
                <Text size="sm" fw={500}>
                  Descrição:
                </Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  Descrição será atualizada
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
