import { ConfirmationModal } from "@components/shared/ConfirmationModal/ConfirmationModal";
import { useMantineColorScheme } from "@mantine/core";
import {
  IconAlertTriangle,
  IconToggleLeft,
  IconToggleRight,
} from "@tabler/icons-react";

interface StatusConfirmationProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  pendingStatus: boolean;
}

export function StatusConfirmation({
  opened,
  onClose,
  onConfirm,
  productName,
  pendingStatus,
}: StatusConfirmationProps) {
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
    <ConfirmationModal
      opened={opened}
      onClose={onClose}
      onConfirm={onConfirm}
      title={pendingStatus ? "Ativar Produto" : "Desativar Produto"}
      icon={
        <IconAlertTriangle
          size={24}
          color={`var(--mantine-color-${iconColor})`}
        />
      }
      headerText={`${
        pendingStatus ? "Ativar" : "Desativar"
      } o produto "${productName}"?`}
      headerSubtext={
        pendingStatus
          ? "O produto ficará visível nas listagens públicas e poderá receber novos produtos."
          : "O produto será ocultado das listagens públicas, mas os produtos existentes permanecerão ativos."
      }
      confirmLabel={pendingStatus ? "Ativar Produto" : "Desativar Produto"}
      confirmColor={pendingStatus ? "green" : "orange"}
      highlightBox={{
        icon: pendingStatus ? (
          <IconToggleRight size={20} color="var(--mantine-color-green-6)" />
        ) : (
          <IconToggleLeft size={20} color="var(--mantine-color-orange-6)" />
        ),
        title: `Status: ${pendingStatus ? "Ativo" : "Inativo"}`,
        subtitle: pendingStatus ? "Visível publicamente" : "Oculto do público",
        bgColor: paperBg,
      }}
    />
  );
}
