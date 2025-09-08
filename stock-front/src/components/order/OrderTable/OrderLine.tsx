import { Badge, Button, Group, Table, Text } from "@mantine/core";
import { getPaymentMethodLabel } from "@services/order.service";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../types/order";
import { getOrderStatusInfo, getPaymentStatusInfo } from "../../../utils/status-mapper";
import { formatDate } from "../../../utils/formatDate";

export const OrderLine = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <Table.Tr key={order.publicId}>
      <Table.Td>
        <div>
          <Text fw={500}>{order.user.name}</Text>
          <Text size="sm" c="dimmed">
            {order.user.email}
          </Text>
        </div>
      </Table.Td>

      <Table.Td>
        <Badge color={getOrderStatusInfo(order.status).color} size="sm">
          {getOrderStatusInfo(order.status).label}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Badge color={getPaymentStatusInfo(order.paymentStatus).color} size="sm">
          {getPaymentStatusInfo(order.paymentStatus).label}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500}>
          {getPaymentMethodLabel(order.paymentMethodType)}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fw={500}>{formatCurrency(order.totalAmount)}</Text>
      </Table.Td>

      <Table.Td>
        <Text fw={500}>{order.totalItems}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{formatDate(order.createdAt)}</Text>
      </Table.Td>

      <Table.Td>
        <Group>
          <Button
            variant="light"
            leftSection={<IconEye size={14} />}
            onClick={() => navigate(`/orders/${order.publicId}`)}
          >
            Detalhes
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
