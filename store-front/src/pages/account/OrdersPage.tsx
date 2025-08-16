import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconCreditCard,
  IconPackage,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import orderService, { OrderListResponse } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.findUserOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "yellow",
      CONFIRMED: "blue",
      PROCESSING: "indigo",
      SHIPPED: "purple",
      DELIVERED: "green",
      CANCELLED: "red",
    };
    return statusColors[status] || "gray";
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      PENDING: "Aguardando Pagamento",
      CONFIRMED: "Pagamento Confirmado",
      PROCESSING: "Em Preparação",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
    };
    return statusTexts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: Record<string, any> = {
      PENDING: IconPackage,
      CONFIRMED: IconCheck,
      PROCESSING: IconPackage,
      SHIPPED: IconTruck,
      DELIVERED: IconCheck,
      CANCELLED: IconX,
    };
    return statusIcons[status] || IconPackage;
  };

  const getPaymentMethodText = (method: string) => {
    const methodTexts: Record<string, string> = {
      CREDIT_CARD: "Cartão de Crédito",
      PIX: "PIX",
      BANK_TRANSFER: "Transferência Bancária",
    };
    return methodTexts[method] || method;
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Erro ao carregar pedidos"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
        <Center mt="md">
          <Button onClick={loadOrders} variant="outline">
            Tentar Novamente
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/account")}
            >
              Voltar
            </Button>
          </Group>
        </Group>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card
            p="xl"
            radius="md"
            ta="center"
            style={{
              border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
              backgroundColor: isDark ? "#212529" : "white",
            }}
          >
            <IconPackage size={48} color="var(--mantine-color-gray-5)" />
            <Title order={3} mt="md" c="dimmed">
              Nenhum pedido encontrado
            </Title>
            <Text c="dimmed" mt="xs">
              Você ainda não fez nenhum pedido. Que tal começar a comprar?
            </Text>
            <Button
              mt="md"
              onClick={() => navigate("/")}
              leftSection={<IconPackage size={16} />}
            >
              Ver Produtos
            </Button>
          </Card>
        ) : (
          <Stack gap="md">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Paper
                  key={order.publicId}
                  p="lg"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? DARK_COLOR : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                  onClick={() => navigate(`/orders/${order.publicId}`)}
                >
                  <Group justify="space-between" align="start">
                    <Stack gap="sm" style={{ flex: 1 }}>
                      <Group gap="md" align="center">
                        <Badge
                          size="lg"
                          color={getStatusColor(order.status)}
                          variant="light"
                          leftSection={<StatusIcon size={12} />}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                        <Text size="sm" c="dimmed" ff="monospace">
                          #{order.publicId.slice(0, 8).toUpperCase()}
                        </Text>
                      </Group>

                      <Group gap="lg">
                        <Group gap="xs">
                          <IconCalendar
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </Text>
                        </Group>

                        <Group gap="xs">
                          <IconPackage
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {order.totalItems} item
                            {order.totalItems !== 1 ? "s" : ""}
                          </Text>
                        </Group>

                        <Group gap="xs">
                          <IconCreditCard
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {getPaymentMethodText(order.paymentMethodType)}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>

                    <Stack gap="xs" align="end">
                      <Text fw={700} size="lg">
                        {formatPrice(order.totalAmount)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {order.paymentStatus}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
