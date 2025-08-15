import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Container,
  Title,
  Card,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Paper,
  useMantineColorScheme,
  rem,
  LoadingOverlay,
  Alert,
  Center,
  Divider,
  SimpleGrid,
  Image,
  Box,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconPackage,
  IconTruck,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconMapPin,
} from "@tabler/icons-react";
import orderService, { OrderResponse } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";

export function OrderDetailsPage() {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.findOrderByPublicId(orderId);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar detalhes do pedido");
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

  if (error || !order) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Erro ao carregar pedido"
          color="red"
          variant="light"
        >
          {error || "Pedido não encontrado"}
        </Alert>
        <Center mt="md">
          <Button onClick={() => navigate("/orders")} variant="outline">
            Voltar para Pedidos
          </Button>
        </Center>
      </Container>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/orders")}
            >
              Voltar
            </Button>
          </Group>
          <Badge
            size="xl"
            color={getStatusColor(order.status)}
            variant="light"
            leftSection={<StatusIcon size={16} />}
          >
            {getStatusText(order.status)}
          </Badge>
        </Group>

        {/* Order Info */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {/* Order Summary */}
          <Card shadow="md" p="lg" radius="lg">
            <Title order={3} mb="md">
              Informações do Pedido
            </Title>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Número do Pedido:
                </Text>
                <Text fw={600} ff="monospace">
                  #{order.publicId.slice(0, 8).toUpperCase()}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Data do Pedido:
                </Text>
                <Text>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Última Atualização:
                </Text>
                <Text>
                  {new Date(order.updatedAt).toLocaleDateString("pt-BR")}
                </Text>
              </Group>
              {order.notes && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Observações:
                  </Text>
                  <Text style={{ maxWidth: "200px" }} ta="end">
                    {order.notes}
                  </Text>
                </Group>
              )}
            </Stack>
          </Card>

          {/* Payment Info */}
          <Card shadow="md" p="lg" radius="lg">
            <Title order={3} mb="md">
              Informações de Pagamento
            </Title>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Método:
                </Text>
                <Text fw={600}>
                  {getPaymentMethodText(order.paymentMethodType)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Nome:
                </Text>
                <Text>{order.paymentMethodName}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Status:
                </Text>
                <Badge
                  color={order.paymentStatus === "PAID" ? "green" : "yellow"}
                  variant="light"
                >
                  {order.paymentStatus === "PAID" ? "Pago" : "Pendente"}
                </Badge>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Shipping Address */}
        <Card shadow="md" p="lg" radius="lg">
          <Group gap="sm" mb="md">
            <IconMapPin size={20} />
            <Title order={3}>Endereço de Entrega</Title>
          </Group>
          <Text>{order.shippingAddress.name}</Text>
          <Text>
            {order.shippingAddress.street}, {order.shippingAddress.number}
            {order.shippingAddress.complement &&
              ` - ${order.shippingAddress.complement}`}
          </Text>
          <Text>
            {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/
            {order.shippingAddress.state}
          </Text>
          <Text>CEP: {order.shippingAddress.postalCode}</Text>
        </Card>

        {/* Order Items */}
        <Card shadow="md" p="lg" radius="lg">
          <Title order={3} mb="md">
            Itens do Pedido
          </Title>
          <Stack gap="md">
            {order.items.map((item) => (
              <Paper
                key={item.id}
                p="sm"
                style={{
                  border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                  borderRadius: rem(8),
                  backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                }}
              >
                <Stack gap="sm">
                  <Group align="start" wrap="nowrap">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.productName}
                      w={{ base: 80, sm: 100 }}
                      h={{ base: 80, sm: 100 }}
                      radius="sm"
                      style={{ objectFit: "cover", flexShrink: 0 }}
                    />

                    <Stack gap={6} style={{ flex: 1 }}>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {item.productName}
                      </Text>
                      <Group gap="xs">
                        <Box
                          key={item.color}
                          w={20}
                          h={20}
                          style={{
                            backgroundColor: item.color,
                            borderRadius: "50%",
                          }}
                        />
                        <Badge
                          size="sm"
                          color={isDark ? "white" : "dark"}
                          variant="outline"
                        >
                          {item.size}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {formatPrice(item.unitPrice)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Quantidade: {item.quantity}
                      </Text>
                    </Stack>

                    <Stack align="flex-end" justify="space-between" h="100%">
                      <Text fw={600} size="sm">
                        {formatPrice(item.totalPrice)}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Card>

        {/* Order Summary */}
        <Card shadow="md" p="lg" radius="lg">
          <Title order={3} mb="md">
            Resumo Financeiro
          </Title>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text>Subtotal dos Itens:</Text>
              <Text>{formatPrice(order.totalAmount - order.shippingCost)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Frete:</Text>
              <Text>{formatPrice(order.shippingCost)}</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={700} size="lg">
                Total:
              </Text>
              <Text fw={700} size="lg">
                {formatPrice(order.totalAmount)}
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
