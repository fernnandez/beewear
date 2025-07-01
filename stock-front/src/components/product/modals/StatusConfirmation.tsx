import { ConfirmationModal } from "@components/shared/ConfirmationModal";
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
  return (
    <ConfirmationModal
      opened={opened}
      onClose={onClose}
      onConfirm={onConfirm}
      title={pendingStatus ? "Ativar Produto" : "Desativar Produto"}
      icon={<IconAlertTriangle size={24} />}
      iconColor={
        pendingStatus
          ? "var(--mantine-color-green-6)"
          : "var(--mantine-color-orange-6)"
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
        bgColor: pendingStatus
          ? "var(--mantine-color-green-0)"
          : "var(--mantine-color-orange-0)",
      }}
    />
  );
}
