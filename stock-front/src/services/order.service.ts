import type { Order, OrderDetails } from "../types/order";
import { OrderStatus } from "../types/order";
import api from "./api";

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders");
  return response.data;
};

export const fetchOrderDetails = async (
  publicId: string
): Promise<OrderDetails> => {
  const response = await api.get<OrderDetails>(`/orders/${publicId}`);
  return response.data;
};

export const updateOrderStatus = async (
  publicId: string,
  status: OrderStatus,
  notes?: string
): Promise<void> => {
  await api.patch(`/orders/${publicId}/status`, { status, notes });
};

export const markOrderAsShipped = async (
  publicId: string,
  notes: string
): Promise<void> => {
  await api.post(`/orders/${publicId}/mark-as-shipped`, { notes });
};

export const markOrderAsCanceled = async (
  publicId: string,
  notes: string
): Promise<void> => {
  await api.post(`/orders/${publicId}/mark-as-canceled`, { notes });
};

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const statusLabels = {
    [OrderStatus.PENDING]: "Pendente",
    [OrderStatus.CONFIRMED]: "Confirmado e em Preparação",
    [OrderStatus.SHIPPED]: "Enviado",
    [OrderStatus.DELIVERED]: "Entregue",
    [OrderStatus.CANCELLED]: "Cancelado",
  };
  return statusLabels[status];
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  const statusColors = {
    [OrderStatus.PENDING]: "yellow",
    [OrderStatus.CONFIRMED]: "blue",
    [OrderStatus.SHIPPED]: "green",
    [OrderStatus.DELIVERED]: "teal",
    [OrderStatus.CANCELLED]: "red",
  };
  return statusColors[status];
};

export const getPaymentStatusLabel = (status: string): string => {
  const paymentStatusLabels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    FAILED: "Falhou",
    REFUNDED: "Reembolsado",
  };
  return paymentStatusLabels[status] || status;
};

export const getPaymentStatusColor = (status: string): string => {
  const paymentStatusColors: Record<string, string> = {
    PENDING: "yellow",
    PAID: "green",
    FAILED: "red",
    REFUNDED: "gray",
  };
  return paymentStatusColors[status] || "gray";
};

export const getPaymentMethodLabel = (method: string): string => {
  const paymentMethodLabels: Record<string, string> = {
    // Métodos Stripe padrão
    card: "Cartão de Crédito/Débito",
    klarna: "Klarna",
    mbway: "MB WAY",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    ideal: "iDEAL",
    sepa_debit: "Débito SEPA",
    sofort: "SOFORT",
    bancontact: "Bancontact",
    eps: "EPS",
    giropay: "GiroPay",
    przelewy24: "Przelewy24",
  };

  if (!method) {
    return "Método de pagamento";
  }

  return (
    paymentMethodLabels[method] ||
    method.charAt(0).toUpperCase() + method.slice(1).replace(/_/g, " ")
  );
};

export const getPaymentMethodIcon = (method: string): string => {
  const paymentMethodIcons: Record<string, string> = {
    // Métodos Stripe padrão
    card: "💳",
    klarna: "🛒",
    mbway: "📱",
    apple_pay: "🍎",
    google_pay: "🤖",
    ideal: "🏦",
    sepa_debit: "🇪🇺",
    sofort: "🇩🇪",
    bancontact: "🇧🇪",
    eps: "🇦🇹",
    giropay: "🇩🇪",
    przelewy24: "🇵🇱",

    // Métodos customizados do sistema
    CREDIT_CARD: "💳",
    PIX: "📱",
    BANK_TRANSFER: "🏦",
    OTHER: "💳",
  };

  return paymentMethodIcons[method] || "💳";
};

export const getPaymentMethodDescription = (method: string): string => {
  const paymentMethodDescriptions: Record<string, string> = {
    // Métodos Stripe padrão
    card: "Pagamento com cartão de crédito ou débito",
    klarna: "Pague em 4x sem juros ou em 30 dias",
    mbway: "Pagamento móvel através do MB WAY",
    apple_pay: "Pagamento com Apple Pay",
    google_pay: "Pagamento com Google Pay",
    ideal: "Pagamento bancário online",
    sepa_debit: "Débito direto bancário europeu",
    sofort: "Pagamento bancário online alemão",
    bancontact: "Pagamento bancário belga",
    eps: "Pagamento bancário austríaco",
    giropay: "Pagamento bancário alemão",
    przelewy24: "Pagamento bancário polonês",

    // Métodos customizados do sistema
    CREDIT_CARD: "Pagamento com cartão de crédito ou débito",
    PIX: "Pagamento instantâneo via PIX",
    BANK_TRANSFER: "Transferência bancária tradicional",
    OTHER: "Outro método de pagamento",
  };

  return paymentMethodDescriptions[method] || "Método de pagamento";
};
