import { ConfirmationModal } from "@components/shared/ConfirmationModal";
import { Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface SaveChangesConfirmationProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  originalData: { name: string; description?: string };
  editData: { name: string; description?: string };
}

export function SaveChangesConfirmation({
  opened,
  onClose,
  onConfirm,
  originalData,
  editData,
}: SaveChangesConfirmationProps) {
  return (
    <ConfirmationModal
      opened={opened}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirmar Alterações"
      icon={<IconAlertTriangle size={24} />}
      iconColor="var(--mantine-color-blue-6)"
      headerText="Salvar alterações no produto?"
      headerSubtext="As seguintes informações serão atualizadas:"
      confirmLabel="Confirmar e Salvar"
      confirmColor="blue"
    >
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
            <Text size="sm" c="dimmed">
              Descrição será atualizada
            </Text>
          </div>
        )}
      </Stack>
    </ConfirmationModal>
  );
}
