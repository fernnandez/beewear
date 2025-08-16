import orderService from "@services/order.service";
import { IconPackage, IconCheck, IconTruck, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.findUserOrders(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useOrder = (publicId: string) => {
  return useQuery({
    queryKey: ["order", publicId],
    queryFn: () => orderService.findOrderByPublicId(publicId),
    enabled: !!publicId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    PENDING: "yellow",
    CONFIRMED: "blue",
    PROCESSING: "indigo",
    SHIPPED: "purple",
    DELIVERED: "green",
    CANCELLED: "red",
  };
  return statusColors[status] || "gray";
};

export const getStatusText = (status: string) => {
  const statusTexts: Record<string, string> = {
    PENDING: "Aguardando Pagamento",
    CONFIRMED: "Pagamento Confirmado",
    PROCESSING: "Em Preparação",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };
  return statusTexts[status] || status;
};

export const getStatusIcon = (status: string) => {
  const statusIcons: Record<string, React.ElementType> = {
    PENDING: IconPackage,
    CONFIRMED: IconCheck,
    PROCESSING: IconPackage,
    SHIPPED: IconTruck,
    DELIVERED: IconCheck,
    CANCELLED: IconX,
  };
  return statusIcons[status] || IconPackage;
};

export const getPaymentMethodText = (method: string) => {
  const methodTexts: Record<string, string> = {
    CREDIT_CARD: "Cartão de Crédito",
    PIX: "PIX",
    BANK_TRANSFER: "Transferência Bancária",
  };
  return methodTexts[method] || method;
};
