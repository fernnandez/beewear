import { OrderItem } from "../../../types/order";
import { 
  Avatar, 
  Card, 
  Group, 
  Table, 
  Text, 
  Title 
} from "@mantine/core";

interface OrderItemsSectionProps {
  orderPublicId: string;
  items: OrderItem[];
}

export const OrderItemsSection = ({ items }: OrderItemsSectionProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group>
          <Title order={4}>Itens do Pedido ({items.length})</Title>
        </Group>
      </Card.Section>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Produto</Table.Th>
            <Table.Th>Variação</Table.Th>
            <Table.Th>Tamanho</Table.Th>
            <Table.Th>Quantidade</Table.Th>
            <Table.Th>Preço Unitário</Table.Th>
            <Table.Th>Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>
                <Group>
                  <Avatar
                    color="yellow"
                    radius="sm"
                    size="md"
                    src={item.image ?? undefined}
                  >
                    {item.productName.charAt(0)}
                  </Avatar>
                  <div>
                    <Text fw={500}>{item.productName}</Text>
                    <Text size="sm" c="dimmed">
                      ID: {item.productVariationSizePublicId.slice(0, 8)}...
                    </Text>
                  </div>
                </Group>
              </Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <Text fw={500}>{item.variationName}</Text>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      border: "1px solid #e0e0e0",
                    }}
                    title={item.variationName}
                  />
                </Group>
              </Table.Td>

              <Table.Td>
                <Text fw={500}>{item.size}</Text>
              </Table.Td>

              <Table.Td>
                <Text fw={500}>{item.quantity}</Text>
              </Table.Td>

              <Table.Td>
                <Text fw={500}>
                  {formatCurrency(item.unitPrice)}
                </Text>
              </Table.Td>

              <Table.Td>
                <Text fw={700}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="flex-end" mt="lg">
        <div>
          <Text size="sm" c="dimmed">
            Total de Itens
          </Text>
          <Text fw={700} size="lg">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Valor Total
          </Text>
          <Text fw={700} size="lg">
            {formatCurrency(items.reduce((sum, item) => sum + item.totalPrice, 0))}
          </Text>
        </div>
      </Group>
    </Card>
  );
};
