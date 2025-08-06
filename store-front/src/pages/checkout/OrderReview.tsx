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
import {
  IconArrowLeft,
  IconCheck,
  IconCreditCard,
  IconMapPin,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@utils/formatPrice";
import { Link, Navigate, useNavigate } from "react-router";
import { AddressService } from "../../services/address.service";
import { Address } from "../../types/address";

export function OrderReview() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { items, getTotalPrice } = useCart();
  const { isAutenticated } = useAuth();
  const navigate = useNavigate();
  const { selectedAddressId, selectedPaymentId } = useCheckout();

  const { data: addresses = [] } = useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: AddressService.findAll,
  });

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const paymentMethods = [
    {
      id: "1",
      type: "card",
      name: "Cartão Principal",
      lastFour: "1234",
      brand: "Visa",
    },
    {
      id: "2",
      type: "card",
      name: "Cartão Secundário",
      lastFour: "5678",
      brand: "Mastercard",
    },
    {
      id: "3",
      type: "pix",
      name: "PIX",
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
      // Aqui seria feita a chamada para a API para criar o pedido
      console.log("Criando pedido...", {
        items,
        address: selectedAddress,
        payment: selectedPayment,
      });

      // Simular criação do pedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirecionar para página de sucesso
      navigate("/order-success");
    } catch (error) {
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
                      p="sm"
                      style={{
                        border: isDark
                          ? "1px solid #212529"
                          : "1px solid #e9ecef",
                        borderRadius: rem(8),
                        backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                      }}
                    >
                      <Group key={item.publicId} align="start" wrap="nowrap">
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
                    style={{
                      backgroundColor: isDark ? "#fbbf24" : undefined,
                      color: isDark ? "#000" : undefined,
                    }}
                  >
                    Confirmar Pedido
                  </Button>

                  <Button
                    variant="outline"
                    component={Link}
                    to="/checkout"
                    fullWidth
                  >
                    Voltar e Editar
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
