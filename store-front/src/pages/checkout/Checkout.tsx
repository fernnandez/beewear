import { useCart } from "@contexts/cart-context";
import { useAuth } from "@contexts/auth-context";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Divider,
  useMantineColorScheme,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, Navigate } from "react-router";
import { AddressSection } from "@components/checkout/AddressSection";
import { PaymentSection } from "@components/checkout/PaymentSection";
import { OrderSummary } from "@components/checkout/OrderSummary";

export function Checkout() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { items, getTotalPrice } = useCart();
  const { isAutenticated } = useAuth();

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
              <AddressSection />
              <PaymentSection />
            </Stack>
          </Grid.Col>

          {/* Right Column - Order Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
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
              <OrderSummary />
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
} 