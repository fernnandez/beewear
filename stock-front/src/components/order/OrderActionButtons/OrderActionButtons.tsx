import { Card, Group, Title } from "@mantine/core";
import { OrderDetails } from "../../../types/order";
import { OrderCancelAction } from "../OrderCancelAction/OrderCancelAction";
import { OrderStatusAction } from "../OrderStatusAction/OrderStatusAction";

interface OrderActionButtonsProps {
  order: OrderDetails;
  onStatusUpdate?: (newStatus: string) => void;
}

export const OrderActionButtons = ({
  order,
  onStatusUpdate,
}: OrderActionButtonsProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <Title order={4}>Ações do Pedido</Title>
        </Group>
      </Card.Section>
      <Group justify="flex-end">
        <OrderStatusAction order={order} onStatusUpdate={onStatusUpdate} />
        <OrderCancelAction order={order} onStatusUpdate={onStatusUpdate} />
      </Group>
    </Card>
  );
};
