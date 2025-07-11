import { Button, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { ReactNode } from "react";

type HighlightBox = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  bgColor?: string;
};

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  icon?: ReactNode;
  iconColor?: string;
  headerText: string;
  headerSubtext?: string;
  message?: string; // ✅ NOVO: mensagem simples
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  highlightBox?: HighlightBox;
  children?: ReactNode; // ✅ Para conteúdo customizado (fallback do message)
}

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title,
  icon = <IconAlertTriangle size={24} />,
  iconColor = "var(--mantine-color-blue-6)",
  headerText,
  headerSubtext,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "blue",
  highlightBox,
  children,
}: ConfirmationModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack>
        {/* Header */}
        <Group>
          <div style={{ color: iconColor }}>{icon}</div>
          <div>
            <Text fw={500}>{headerText}</Text>
            {headerSubtext && (
              <Text size="sm" c="dimmed">
                {headerSubtext}
              </Text>
            )}
          </div>
        </Group>

        {/* Mensagem simples */}
        {message && (
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        )}

        {/* Destaque visual (ex: status do item) */}
        {highlightBox && (
          <Paper p="md" withBorder bg={highlightBox.bgColor ?? ""}>
            <Group>
              {highlightBox.icon}
              <div>
                <Text size="sm" fw={500}>
                  {highlightBox.title}
                </Text>
                {highlightBox.subtitle && (
                  <Text size="xs" c="dimmed">
                    {highlightBox.subtitle}
                  </Text>
                )}
              </div>
            </Group>
          </Paper>
        )}

        {/* Conteúdo customizado adicional */}
        {children}

        {/* Ações */}
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button color={confirmColor} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
