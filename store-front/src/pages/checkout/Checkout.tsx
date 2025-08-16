import { AddressSection } from "@components/checkout/AddressSection";
import { OrderSummary } from "@components/checkout/OrderSummary";
import { PaymentSection } from "@components/checkout/PaymentSection";
import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import { useCheckout } from "@contexts/checkout-context";
import {
  Button,
  Container,
  Grid,
  Group,
  rem,
  Stack,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, Navigate } from "react-router";

export function Checkout() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { items } = useCart();
  const { isAutenticated } = useAuth();

  // Usar o hook useCheckout de forma mais simples
  const checkout = useCheckout();
  const {
    selectedAddressId,
    setSelectedAddressId,
    setSelectedAddress,
    isCheckoutComplete,
  } = checkout;

  // Redirecionar se não estiver autenticado ou se o carrinho estiver vazio
  if (!isAutenticated) {
    return <Navigate to="/" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            to="/"
            color={isDark ? "white" : "dark"}
          >
            Voltar
          </Button>
          <Title order={1} fw={700} size={rem(32)}>
            Finalizar Compra
          </Title>
        </Group>

        {/* Main Content */}
        <Grid gutter="xl">
          {/* Left Column - Address and Payment */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              <AddressSection
                selectedAddress={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
                onAddressSelectFull={setSelectedAddress}
              />
              <PaymentSection />
            </Stack>
          </Grid.Col>

          {/* Right Column - Order Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <OrderSummary isCheckoutComplete={isCheckoutComplete} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
