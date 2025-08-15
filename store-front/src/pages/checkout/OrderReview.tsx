import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import { useCheckout } from "@contexts/checkout-context";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconCheck,
  IconCreditCard,
  IconMapPin,
} from "@tabler/icons-react";
import { formatPrice } from "@utils/formatPrice";
import { Link, Navigate } from "react-router";

export function OrderReview() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAutenticated } = useAuth();

  const { selectedAddress, selectedPaymentId, createOrder, isCreatingOrder } =
    useCheckout();

  const paymentMethods = [
    {
      id: "credit_card",
      type: "card",
      name: "Cartão de Crédito",
      lastFour: "1234",
      brand: "Visa",
    },
    {
      id: "pix",
      type: "pix",
      name: "PIX",
    },
    {
      id: "bank_transfer",
      type: "transfer",
      name: "Transferência Bancária",
    },
  ];

  const selectedPayment = paymentMethods.find(
    (pay) => pay.id === selectedPaymentId
  );

  // Redirecionar se não estiver autenticado ou se o carrinho estiver vazio
  if (!isAutenticated) {
    return <Navigate to="/" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!selectedAddress || !selectedPayment) {
    return <Navigate to="/checkout" replace />;
  }

  const handleConfirmOrder = async () => {
    try {
      await createOrder();
      clearCart();

      notifications.show({
        title: "Pedido criado com sucesso",
        message: "Você pode visualizar o pedido no seu perfil.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Erro ao criar pedido",
        message:
          "Ocorreu um erro ao tentar criar seu pedido. Por favor, tente novamente.",
        color: "red",
      });

      console.error("Erro ao criar pedido:", error);
    }
  };

  const getPaymentDisplayName = (payment: any) => {
    if (payment.type === "card") {
      return `${payment.brand} •••• ${payment.lastFour}`;
    }
    return payment.name;
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            to="/checkout"
            color={isDark ? "white" : "dark"}
          >
            Voltar ao Checkout
          </Button>
          <Title order={1} fw={700} size={rem(32)}>
            Revisar Pedido
          </Title>
        </Group>

        {/* Conteúdo Principal */}
        <Grid gutter="xl">
          {/* Coluna Esquerda - Detalhes do Pedido */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="xl">
              {/* Itens do Pedido */}
              <Paper p="xl" radius="md">
                <Title order={2} fw={700} size={rem(24)} mb="lg">
                  Itens do Pedido
                </Title>
                <Stack gap="md">
                  {items.map((item) => (
                    <Paper
                      key={item.productVariationSizePublicId}
                      p="sm"
                      style={{
                        border: isDark
                          ? "1px solid #212529"
                          : "1px solid #e9ecef",
                        borderRadius: rem(8),
                        backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                      }}
                    >
                      <Group
                        key={item.productVariationSizePublicId}
                        align="start"
                        wrap="nowrap"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          w={80}
                          h={80}
                          radius="sm"
                          style={{ objectFit: "cover", flexShrink: 0 }}
                        />
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {item.name}
                          </Text>
                          <Group gap="xs">
                            <Box
                              w={16}
                              h={16}
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
                            <Text size="sm" c="dimmed">
                              Qtd: {item.quantity}
                            </Text>
                          </Group>
                          <Text size="sm" c="dimmed">
                            {formatPrice(item.price)} cada
                          </Text>
                        </Stack>
                        <Text fw={600} size="sm">
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              {/* Endereço de Entrega */}
              <Paper p="xl" radius="md">
                <Group mb="md">
                  <IconMapPin size={20} />
                  <Title order={2} fw={700} size={rem(24)}>
                    Endereço de Entrega
                  </Title>
                </Group>
                <Paper
                  p="sm"
                  style={{
                    border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                    borderRadius: rem(8),
                    backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                  }}
                >
                  <Stack gap={4}>
                    <Text fw={600} size="sm">
                      {selectedAddress.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedAddress.street}, {selectedAddress.number}
                      {selectedAddress.complement &&
                        ` - ${selectedAddress.complement}`}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedAddress.neighborhood}, {selectedAddress.city} -{" "}
                      {selectedAddress.state}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedAddress.postalCode}, {selectedAddress.country}
                    </Text>
                  </Stack>
                </Paper>
              </Paper>

              {/* Método de Pagamento */}
              <Paper p="xl" radius="md">
                <Group mb="md">
                  <IconCreditCard size={20} />
                  <Title order={2} fw={700} size={rem(24)}>
                    Método de Pagamento
                  </Title>
                </Group>
                <Paper
                  p="sm"
                  style={{
                    border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                    borderRadius: rem(8),
                    backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                  }}
                >
                  <Stack gap={4}>
                    <Text fw={600} size="sm">
                      {selectedPayment.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {getPaymentDisplayName(selectedPayment)}
                    </Text>
                  </Stack>
                </Paper>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Coluna Direita - Resumo e Confirmação */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper
              p="xl"
              radius="md"
              style={{
                border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                backgroundColor: isDark ? "#212529" : "white",
                position: "sticky",
                top: rem(80),
              }}
            >
              <Stack gap="lg">
                <Title order={2} fw={700} size={rem(24)}>
                  Resumo do Pedido
                </Title>

                {/* Subtotal */}
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Subtotal ({items.length}{" "}
                    {items.length === 1 ? "item" : "itens"}):
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatPrice(getTotalPrice())}
                  </Text>
                </Group>

                {/* Frete (mockado) */}
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Frete:
                  </Text>
                  <Text size="sm" fw={500}>
                    Grátis
                  </Text>
                </Group>

                <Divider />

                {/* Total */}
                <Group justify="space-between">
                  <Text size="md" fw={600}>
                    Total:
                  </Text>
                  <Text size="lg" fw={700}>
                    {formatPrice(getTotalPrice())}
                  </Text>
                </Group>

                {/* Botões */}
                <Stack gap="sm">
                  <Button
                    leftSection={<IconCheck size={16} />}
                    size="md"
                    color="dark"
                    fullWidth
                    onClick={handleConfirmOrder}
                    loading={isCreatingOrder}
                    disabled={isCreatingOrder}
                    style={{
                      backgroundColor: isDark ? "#fbbf24" : undefined,
                      color: isDark ? "#000" : undefined,
                    }}
                  >
                    {isCreatingOrder ? "Processando..." : "Confirmar Pedido"}
                  </Button>
                </Stack>

                <Text size="xs" c="dimmed" ta="center">
                  Ao confirmar, você concorda com nossos termos de serviço
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
