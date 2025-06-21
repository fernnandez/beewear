import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  type ModalProps,
} from "@mantine/core";
import type { ReactNode } from "react";

interface ConfirmationModalProps extends ModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  icon?: ReactNode;
  statusLabel?: string;
  statusHelper?: string;
  statusColor?: string;
  statusBg?: string;
  confirmIcon?: ReactNode;
  children?: ReactNode;
}

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "red",
  icon,
  confirmIcon,
  statusLabel,
  statusHelper,
  statusBg,
  children,
  ...modalProps
}: ConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      {...modalProps}
    >
      <Stack>
        {icon && (
          <Group>
            {icon}
            <Box>
              <Text fw={500}>{message}</Text>
            </Box>
          </Group>
        )}

        {!icon && <Text>{message}</Text>}

        {statusLabel && (
          <Paper p="md" withBorder bg={statusBg}>
            <Group>
              {confirmIcon}
              <div>
                <Text size="sm" fw={500}>
                  {statusLabel}
                </Text>
                <Text size="xs" c="dimmed">
                  {statusHelper}
                </Text>
              </div>
            </Group>
          </Paper>
        )}

        {children}

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            leftSection={confirmIcon}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
