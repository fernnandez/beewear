import { OrderStatusStepper } from "@components/shared/OrderStatusStepper";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconMapPin,
  IconPackage,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { DARK_BORDER_COLOR, DARK_COLOR } from "@utils/constants";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
      console.log(orderData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar detalhes do pedido");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methodTexts: Record<string, string> = {
      CREDIT_CARD: "Cartão de Crédito",
      PIX: "PIX",
      BANK_TRANSFER: "Transferência Bancária",
    };
    return methodTexts[method] || method;
  };

  const getOrderStatusColor = (status: string) => {
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

  const getOrderStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      PENDING: "Aguardando Pagamento",
      CONFIRMED: "Pedido Confirmado",
      PROCESSING: "Em Preparação",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
    };
    return statusTexts[status] || status;
  };

  const getOrderStatusIcon = (status: string) => {
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
          <Text fw={600} size="lg">
            Pedido #{order.publicId.slice(0, 8).toUpperCase()}
          </Text>
        </Group>

        {/* Order Items */}
        <Card
          shadow="md"
          p="lg"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
          <Title order={3} mb="md">
            Itens do Pedido
          </Title>
          <Stack gap="md">
            {order.items.map((item) => (
              <Paper
                key={item.id}
                p="sm"
                withBorder
                style={{
                  backgroundColor: isDark ? DARK_BORDER_COLOR : "white",
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

        {/* Order Status Overview */}
        <Card
          shadow="md"
          p="lg"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
          <Title order={3} mb="md">
            Status do Pedido
          </Title>

          {/* Order Status */}
          <Stack gap="md">
            {/* Badge de Status */}
            <Badge
              size="lg"
              color={getOrderStatusColor(order.status)}
              variant="light"
              leftSection={(() => {
                const StatusIcon = getOrderStatusIcon(order.status);
                return <StatusIcon size={18} />;
              })()}
            >
              {getOrderStatusText(order.status)}
            </Badge>

            {/* Stepper (apenas para pedidos não cancelados) */}
            {order.status !== "CANCELLED" && (
              <Box style={{ overflow: "hidden" }}>
                <OrderStatusStepper status={order.status} />
              </Box>
            )}

            {/* Descrição do Status */}
            <Text size="xs" c="dimmed">
              {order.status === "CONFIRMED" &&
                "Seu pagamento foi confirmado e estamos preparando seu pedido para envio."}
              {order.status === "PROCESSING" &&
                "Seu pedido está sendo preparado para envio."}
              {order.status === "SHIPPED" &&
                "Seu pedido foi enviado e está a caminho."}
              {order.status === "DELIVERED" &&
                "Seu pedido foi entregue com sucesso!"}
              {order.status === "CANCELLED" && "Este pedido foi cancelado."}
            </Text>
          </Stack>
        </Card>

        {/* Order Info */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {/* Order Summary */}
          <Card
            shadow="md"
            p="lg"
            radius="lg"
            withBorder
            style={{
              backgroundColor: isDark ? DARK_COLOR : "white",
            }}
          >
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
          <Card
            shadow="md"
            p="lg"
            radius="lg"
            withBorder
            style={{
              backgroundColor: isDark ? DARK_COLOR : "white",
            }}
          >
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
                  Data do Pagamento:
                </Text>
                <Text>
                  {order.paymentStatus === "PAID"
                    ? new Date(order.updatedAt).toLocaleDateString("pt-BR")
                    : "Pendente"}
                </Text>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Shipping Address */}
        <Card
          shadow="md"
          p="lg"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
          <Group gap="sm" mb="md">
            <IconMapPin size={20} />
            <Title order={3}>Endereço de Entrega</Title>
          </Group>
          <Text>{order.shippingAddress}</Text>
        </Card>

        {/* Order Summary */}
        <Card
          shadow="md"
          p="lg"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
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
