import { OrderInfoSection } from "@components/order/OrderInfoSection/OrderInfoSection";
import { OrderItemsSection } from "@components/order/OrderItemsSection/OrderItemsSection";
import { OrderStatusAction } from "@components/order/OrderStatusAction/OrderStatusAction";
import { OrderCancelAction } from "@components/order/OrderCancelAction/OrderCancelAction";
import { Button, Container, Divider, Group, Text } from "@mantine/core";
import { fetchOrderDetails } from "@services/order.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-details", publicId],
    queryFn: () => fetchOrderDetails(publicId!),
    enabled: !!publicId,
  });

  if (!order || isLoading) {
    return (
      <Container size="xl">
        <Text>Carregando detalhes do pedido...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Button variant="light" onClick={() => navigate("/orders")}>
            ← Voltar
          </Button>
        </div>
        <Group>
          <OrderStatusAction order={order} />
          <OrderCancelAction order={order} />
        </Group>
      </Group>

      <OrderInfoSection order={order} />

      {/* Itens do Pedido */}
      <OrderItemsSection
        orderPublicId={order.publicId}
        items={order.items}
      />

      <Divider mt={50} mb={50} />
    </Container>
  );
}
