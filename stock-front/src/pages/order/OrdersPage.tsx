import { OrderTable } from "@components/order/OrderTable/OrderTable";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { fetchOrders } from "@services/order.service";
import { IconFilter, IconReceipt, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  ORDER_STATUS_FILTER_OPTIONS, 
  PAYMENT_STATUS_FILTER_OPTIONS 
} from "../../utils/status-mapper";

export default function OrdersPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    string | null
  >("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.publicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !selectedStatus || order.status === selectedStatus;

    const matchesPaymentStatus =
      !selectedPaymentStatus ||
      order.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Pedidos</Title>
            <Text c="dimmed">Gerencie todos os pedidos da loja</Text>
          </div>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconFilter size={18} />
              <Title order={4}>Filtros</Title>
            </Group>
          </Card.Section>

          <Flex gap="md" wrap="wrap">
            <TextInput
              placeholder="Buscar por ID, cliente ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, minWidth: "250px" }}
            />

            <Select
              placeholder="Status do Pedido"
              data={ORDER_STATUS_FILTER_OPTIONS}
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ minWidth: "180px" }}
            />

            <Select
              placeholder="Status do Pagamento"
              data={PAYMENT_STATUS_FILTER_OPTIONS}
              value={selectedPaymentStatus}
              onChange={setSelectedPaymentStatus}
              style={{ minWidth: "180px" }}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("");
                setSelectedPaymentStatus("");
              }}
            >
              Limpar Filtros
            </Button>
          </Flex>
        </Card>

        {/* Lista de Pedidos */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconReceipt size={18} />
              <Title order={4}>
                Lista de Pedidos ({filteredOrders.length})
              </Title>
            </Group>
          </Card.Section>

          <OrderTable orders={filteredOrders} />
        </Card>
      </Container>
    </>
  );
}
