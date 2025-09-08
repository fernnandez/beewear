/**
 * Mapper para tradução de estados de pedidos e pagamentos
 * Converte valores técnicos em textos amigáveis para o utilizador
 */

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED', 
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Mapper para estados de pedidos
 */
export const ORDER_STATUS_MAPPER = {
  [OrderStatus.PENDING]: {
    label: 'Pendente',
    description: 'Aguardando pagamento',
    color: 'orange',
    icon: 'clock',
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmado',
    description: 'Pagamento confirmado, em preparação',
    color: 'blue',
    icon: 'check',
  },
  [OrderStatus.SHIPPED]: {
    label: 'Enviado',
    description: 'Pedido enviado para entrega',
    color: 'green',
    icon: 'truck',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregue',
    description: 'Pedido entregue com sucesso',
    color: 'green',
    icon: 'package',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    description: 'Pedido cancelado',
    color: 'red',
    icon: 'x',
  },
} as const;

/**
 * Mapper para estados de pagamento
 */
export const PAYMENT_STATUS_MAPPER = {
  [PaymentStatus.PENDING]: {
    label: 'Pendente',
    description: 'Aguardando pagamento',
    color: 'orange',
    icon: 'clock',
  },
  [PaymentStatus.PAID]: {
    label: 'Pago',
    description: 'Pagamento confirmado',
    color: 'green',
    icon: 'check',
  },
  [PaymentStatus.FAILED]: {
    label: 'Falhou',
    description: 'Pagamento não processado',
    color: 'red',
    icon: 'x',
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Reembolsado',
    description: 'Valor reembolsado',
    color: 'yellow',
    icon: 'refresh',
  },
} as const;

/**
 * Função utilitária para obter informações de estado de pedido
 */
export function getOrderStatusInfo(status: string) {
  return ORDER_STATUS_MAPPER[status as OrderStatus] || {
    label: status,
    description: 'Estado desconhecido',
    color: 'gray',
    icon: 'help',
  };
}

/**
 * Função utilitária para obter informações de estado de pagamento
 */
export function getPaymentStatusInfo(status: string) {
  return PAYMENT_STATUS_MAPPER[status as PaymentStatus] || {
    label: status,
    description: 'Estado desconhecido',
    color: 'gray',
    icon: 'help',
  };
}

/**
 * Lista de opções para filtros de estado de pedido
 */
export const ORDER_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos os estados' },
  ...Object.entries(ORDER_STATUS_MAPPER).map(([value, info]) => ({
    value,
    label: info.label,
    description: info.description,
  })),
];

/**
 * Lista de opções para filtros de estado de pagamento
 */
export const PAYMENT_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos os estados' },
  ...Object.entries(PAYMENT_STATUS_MAPPER).map(([value, info]) => ({
    value,
    label: info.label,
    description: info.description,
  })),
];

/**
 * Tipos TypeScript para os mappers
 */
export type OrderStatusInfo = typeof ORDER_STATUS_MAPPER[keyof typeof ORDER_STATUS_MAPPER];
export type PaymentStatusInfo = typeof PAYMENT_STATUS_MAPPER[keyof typeof PAYMENT_STATUS_MAPPER];
export type OrderStatusKey = keyof typeof ORDER_STATUS_MAPPER;
export type PaymentStatusKey = keyof typeof PAYMENT_STATUS_MAPPER;
