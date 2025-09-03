import { Badge, Button, Group, Table, Text } from "@mantine/core";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from "@services/order.service";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../types/order";

export const OrderLine = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <Badge color={getOrderStatusColor(order.status)} size="sm">
          {getOrderStatusLabel(order.status)}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Badge color={getPaymentStatusColor(order.paymentStatus)} size="sm">
          {getPaymentStatusLabel(order.paymentStatus)}
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
