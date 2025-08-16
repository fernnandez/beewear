export enum OrderStatus {
  PENDING = 'PENDING', // Pedido criado, aguardando pagamento
  CONFIRMED = 'CONFIRMED', // Pagamento confirmado
  PROCESSING = 'PROCESSING', // Em preparação
  SHIPPED = 'SHIPPED', // Enviado
  DELIVERED = 'DELIVERED', // Entregue
  CANCELLED = 'CANCELLED', // Cancelado
}
