import { Button, Modal, Text } from "@mantine/core";

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ConfirmationModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">{message}</Text>
      <Button fullWidth onClick={onConfirm} color="red" mb="sm">
        {confirmLabel}
      </Button>
      <Button fullWidth variant="default" onClick={onClose}>
        {cancelLabel}
      </Button>
    </Modal>
  );
}
