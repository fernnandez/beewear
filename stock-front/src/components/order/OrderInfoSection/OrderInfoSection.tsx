import { OrderDetails } from "../../../types/order";
import { 
  Badge, 
  Card, 
  Group, 
  SimpleGrid, 
  Text, 
  Title 
} from "@mantine/core";
import { 
  getOrderStatusLabel, 
  getOrderStatusColor, 
  getPaymentMethodLabel,
  getPaymentStatusLabel, 
  getPaymentStatusColor 
} from "@services/order.service";

interface OrderInfoSectionProps {
  order: OrderDetails;
}

export const OrderInfoSection = ({ order }: OrderInfoSectionProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <Title order={4}>Informações do Pedido</Title>
        </Group>
      </Card.Section>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <div>
          <Text size="sm" c="dimmed" mb={4}>
            ID do Pedido
          </Text>
          <Text fw={500} mb="md">
            {order.publicId}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            ID do Pagamento
          </Text>
          <Text fw={500} mb="md">
            {order.paymentIntentId}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Status do Pedido
          </Text>
          <Badge
            color={getOrderStatusColor(order.status)}
            size="lg"
            mb="md"
          >
            {getOrderStatusLabel(order.status)}
          </Badge>

          <Text size="sm" c="dimmed" mb={4}>
            Status do Pagamento
          </Text>
          <Badge
            color={getPaymentStatusColor(order.paymentStatus)}
            size="lg"
            mb="md"
          >
            {getPaymentStatusLabel(order.paymentStatus)}
          </Badge>

          <Text size="sm" c="dimmed" mb={4}>
            Método de Pagamento
          </Text>
          <Text fw={500} mb="md">
            {getPaymentMethodLabel(order.paymentMethodType)}
          </Text>
        </div>

        <div>
          <Text size="sm" c="dimmed" mb={4}>
            Valor Total
          </Text>
          <Text fw={700} size="xl" mb="md">
            {formatCurrency(order.totalAmount)}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Custo de Envio
          </Text>
          <Text fw={500} mb="md">
            {formatCurrency(order.shippingCost)}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Data de Criação
          </Text>
          <Text fw={500} mb="md">
            {formatDate(order.createdAt)}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Última Atualização
          </Text>
          <Text fw={500} mb="md">
            {formatDate(order.updatedAt)}
          </Text>
        </div>
      </SimpleGrid>

      {order.shippingAddress && (
        <div style={{ marginTop: '1rem' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Endereço de Entrega
          </Text>
          <Text fw={500}>
            {order.shippingAddress}
          </Text>
        </div>
      )}

      {order.notes && (
        <div style={{ marginTop: '1rem' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Observações
          </Text>
          <Text fw={500}>
            {order.notes}
          </Text>
        </div>
      )}
    </Card>
  );
};
