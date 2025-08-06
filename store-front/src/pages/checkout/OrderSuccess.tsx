import { useCart } from "@contexts/cart-context";
import {
  Box,
  Button,
  Container,
  Paper,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconCheck, IconHome, IconShoppingBag } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link } from "react-router";

export function OrderSuccess() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Container size="sm" py="xl">
      <Paper
        p="xl"
        radius="md"
        style={{
          border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
          backgroundColor: isDark ? "#212529" : "white",
        }}
      >
        <Stack gap="xl" align="center" ta="center">
          {/* Ícone de Sucesso */}
          <Box
            w={80}
            h={80}
            style={{
              backgroundColor: isDark ? "#fbbf24" : "#22c55e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconCheck size={40} color={isDark ? "#000" : "#fff"} />
          </Box>

          {/* Título */}
          <Stack gap="sm">
            <Title order={1} fw={700} size={rem(32)}>
              Pedido Confirmado!
            </Title>
            <Text size="lg" c="dimmed">
              Seu pedido foi criado com sucesso e está sendo processado.
            </Text>
          </Stack>

          {/* Informações do Pedido */}
          <Stack gap="md" style={{ width: "100%" }}>
            <Text size="sm" c="dimmed">
              Você receberá um e-mail de confirmação com os detalhes do seu
              pedido.
            </Text>
            <Text size="sm" c="dimmed">
              Número do pedido:{" "}
              <Text span fw={600}>
                #ORD-{Date.now().toString().slice(-6)}
              </Text>
            </Text>
          </Stack>

          {/* Botões */}
          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconHome size={16} />}
              size="md"
              color="dark"
              fullWidth
              component={Link}
              to="/"
              style={{
                backgroundColor: isDark ? "#fbbf24" : undefined,
                color: isDark ? "#000" : undefined,
              }}
            >
              Continuar Comprando
            </Button>

            <Button
              leftSection={<IconShoppingBag size={16} />}
              variant="outline"
              fullWidth
              component={Link}
              to="/account"
            >
              Ver Meus Pedidos
            </Button>
          </Stack>

          {/* Informações Adicionais */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              O que acontece agora?
            </Text>
            <Text size="xs" c="dimmed">
              • Seu pedido será processado em até 24 horas
            </Text>
            <Text size="xs" c="dimmed">
              • Você receberá atualizações por e-mail
            </Text>
            <Text size="xs" c="dimmed">
              • O prazo de entrega é de 3-5 dias úteis
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
