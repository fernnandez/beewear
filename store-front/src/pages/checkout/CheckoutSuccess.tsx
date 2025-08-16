import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import api from "@services/api";
import { IconAlertCircle, IconCheck, IconPackage } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface Order {
  publicId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function CheckoutSuccess() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { user, isLoading: authLoading } = useAuth();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Adicionar estado para controlar se já foi verificado
  const [hasChecked, setHasChecked] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // ✅ Só executar depois da autenticação estar completa
    if (authLoading) {
      return; // Aguardar autenticação
    }

    if (!user) {
      setError("Usuário não autenticado");
      setIsLoading(false);
      return;
    }

    if (sessionId && !hasChecked) {
      // ✅ Marcar como verificado para evitar múltiplas chamadas
      setHasChecked(true);
      checkOrderStatus(sessionId);
    } else if (!sessionId) {
      setError("ID da sessão não encontrado");
      setIsLoading(false);
    }
  }, [sessionId, hasChecked, authLoading, user]);

  const checkOrderStatus = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("�� Verificando status do pagamento para sessão:", sessionId);

      // Verificar diretamente na Stripe se o pagamento foi aprovado
      const response = await api.get(`/payments/verify-payment/${sessionId}`);

      if (response.data.success && response.data.paymentStatus === "paid") {
        const orderData = response.data.order;
        if (orderData) {
          setOrder({
            publicId: orderData.publicId || "N/A",
            totalAmount: orderData.totalAmount,
            status: orderData.status || "PENDING",
            createdAt: orderData.createdAt || new Date().toISOString(),
          });

          clearCart();
        } else {
          setError("Dados do pedido não encontrados");
        }
      } else {
        console.log("❌ Pagamento não foi aprovado:", response.data);
        setError(
          "Pagamento não foi aprovado. Verifique o status na sua conta Stripe."
        );
      }
    } catch (error: any) {
      console.error("❌ Erro ao verificar pagamento:", error);

      if (error.response?.status === 404) {
        setError(
          "Sessão não encontrada. Verifique se o pagamento foi processado."
        );
      } else {
        setError(
          "Erro ao verificar status do pagamento. Tente novamente em alguns instantes."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Container size="md" py="xl">
        <Paper
          p="xl"
          radius="md"
          style={{
            border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
            backgroundColor: isDark ? "#212529" : "white",
          }}
          pos="relative"
        >
          <LoadingOverlay visible={true} />
          <Text ta="center">
            {authLoading
              ? "Carregando autenticação..."
              : "Verificando status do pedido..."}
          </Text>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Paper
          p="xl"
          radius="md"
          style={{
            border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
            backgroundColor: isDark ? "#212529" : "white",
          }}
        >
          <Stack gap="lg" align="center">
            <IconAlertCircle size={48} color="#fa5252" />
            <Title order={2} ta="center" c="red">
              {error === "Usuário não autenticado"
                ? "Acesso Negado"
                : "Pedido em Processamento"}
            </Title>
            <Alert color="yellow" title="Aguarde" variant="light">
              <Text size="sm">{error}</Text>
            </Alert>
            {error !== "Usuário não autenticado" && (
              <>
                <Text size="sm" c="dimmed" ta="center">
                  O webhook da Stripe pode levar alguns minutos para processar o
                  pagamento e criar o pedido.
                </Text>
                <Box>
                  <Text size="sm" fw={600}>
                    ID da Sessão: {sessionId}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Guarde este ID para referência
                  </Text>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container size="md" py="xl">
        <Paper
          p="xl"
          radius="md"
          style={{
            border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
            backgroundColor: isDark ? "#212529" : "white",
          }}
        >
          <Stack gap="lg" align="center">
            <IconPackage size={48} color="#228be6" />
            <Title order={2} ta="center">
              Pedido Não Encontrado
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Não foi possível encontrar o pedido para esta sessão.
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Verifique se você está logado e se a sessão é válida.
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper
        p="xl"
        radius="md"
        style={{
          border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
          backgroundColor: isDark ? "#212529" : "white",
        }}
      >
        <Stack gap="xl">
          {/* Header de Sucesso */}
          <Stack gap="md" align="center">
            <IconCheck size={64} color="#40c057" />
            <Title order={1} ta="center" c="green">
              Pagamento Confirmado!
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Seu pedido foi processado com sucesso
            </Text>
          </Stack>

          <Divider />

          {/* Detalhes do Pedido */}
          <Button onClick={() => navigate(`/orders/${order.publicId}`)}>
            Ver Detalhes do pedido
          </Button>

          <Divider />

          {/* Informações Adicionais */}
          <Alert color="blue" title="Próximos Passos" variant="light">
            <Text size="sm">
              • Você receberá um email de confirmação em breve • O pedido será
              processado e enviado conforme prazo • Para dúvidas, entre em
              contato com nosso suporte
            </Text>
          </Alert>
        </Stack>
      </Paper>
    </Container>
  );
}
