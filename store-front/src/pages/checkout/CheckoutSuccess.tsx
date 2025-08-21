import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  LoadingOverlay,
  Center,
} from "@mantine/core";
import { IconCheck, IconAlertCircle, IconArrowRight } from "@tabler/icons-react";
import { useOrderConfirmation } from "@hooks/useOrders";
import { DARK_COLOR } from "@utils/constants";
import { useMantineColorScheme } from "@mantine/core";

export function CheckoutSuccess() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  // Extrair parâmetros da URL manualmente
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  // Usar o hook de confirmação de pedidos
  const {
    isConfirming,
    confirmationError,
    orderConfirmed,
    confirmOrderAfterCheckout,
    checkOrderStatus,
    resetConfirmationState,
  } = useOrderConfirmation();

  // Estado local para controlar a UI
  const [hasAttemptedConfirmation, setHasAttemptedConfirmation] = useState(false);

  useEffect(() => {
    console.log("🎯 CheckoutSuccess montado com:", { orderId, sessionId });

    if (orderId && sessionId) {
      // Tentar confirmar o pedido automaticamente
      handleAutomaticConfirmation();
    } else if (orderId) {
      // Se não tiver sessionId, apenas verificar o status
      handleStatusCheck();
    }
  }, [orderId, sessionId]);

  const handleAutomaticConfirmation = async () => {
    if (!orderId || !sessionId) return;

    console.log("🔄 Tentando confirmação automática...");
    setHasAttemptedConfirmation(true);

    const result = await confirmOrderAfterCheckout(orderId, sessionId);
    
    if (result?.success) {
      console.log("✅ Confirmação automática bem-sucedida!");
    } else {
      console.log("⚠️ Confirmação automática falhou, tentando verificar status...");
      // Se a confirmação falhar, tentar verificar o status
      await checkOrderStatus(orderId);
    }
  };

  const handleStatusCheck = async () => {
    if (!orderId) return;

    console.log("🔍 Verificando status do pedido...");
    setHasAttemptedConfirmation(true);

    await checkOrderStatus(orderId);
  };

  const handleManualConfirmation = async () => {
    if (!orderId || !sessionId) return;

    console.log("🔄 Tentando confirmação manual...");
    const result = await confirmOrderAfterCheckout(orderId, sessionId);
    
    if (result?.success) {
      console.log("✅ Confirmação manual bem-sucedida!");
    }
  };

  const handleRetry = () => {
    resetConfirmationState();
    setHasAttemptedConfirmation(false);
    
    if (orderId && sessionId) {
      handleAutomaticConfirmation();
    } else if (orderId) {
      handleStatusCheck();
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/account/orders/${orderId}`);
    }
  };

  // Renderizar loading enquanto está confirmando
  if (isConfirming && !hasAttemptedConfirmation) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <LoadingOverlay visible={true} />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        {/* Header de Sucesso */}
        <Paper
          p="xl"
          radius="lg"
          style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}
          withBorder
        >
          <Stack gap="md" align="center" ta="center">
            <div style={{ fontSize: "4rem" }}>🎉</div>
            <Title order={1} size="h2">
              Checkout Concluído!
            </Title>
            <Text size="lg" c="dimmed">
              Seu pedido foi processado com sucesso
            </Text>
          </Stack>
        </Paper>

        {/* Status da Confirmação */}
        {hasAttemptedConfirmation && (
          <Paper
            p="xl"
            radius="lg"
            style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}
            withBorder
          >
            <Stack gap="md">
              {orderConfirmed ? (
                <Alert
                  icon={<IconCheck size={16} />}
                  title="Pedido Confirmado!"
                  color="green"
                  variant="light"
                >
                  <Text>
                    Seu pedido foi confirmado e está sendo processado. 
                    Você receberá atualizações por email.
                  </Text>
                </Alert>
              ) : confirmationError ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Atenção"
                  color="yellow"
                  variant="light"
                >
                  <Text>{confirmationError}</Text>
                </Alert>
              ) : null}

              {/* Botões de Ação */}
              <Group justify="center" gap="md">
                {!orderConfirmed && (
                  <>
                    <Button
                      onClick={handleManualConfirmation}
                      loading={isConfirming}
                      disabled={!sessionId}
                      variant="filled"
                      color="blue"
                    >
                      Tentar Confirmar Novamente
                    </Button>
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      disabled={isConfirming}
                    >
                      Verificar Status
                    </Button>
                  </>
                )}
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Informações do Pedido */}
        {orderId && (
          <Paper
            p="xl"
            radius="lg"
            style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}
            withBorder
          >
            <Stack gap="md">
              <Title order={3}>Informações do Pedido</Title>
              <Text>
                <strong>ID do Pedido:</strong> {orderId}
              </Text>
              {sessionId && (
                <Text>
                  <strong>Session ID:</strong> {sessionId}
                </Text>
              )}
            </Stack>
          </Paper>
        )}

        {/* Botões de Navegação */}
        <Paper
          p="xl"
          radius="lg"
          style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}
          withBorder
        >
          <Stack gap="md">
            <Title order={3}>Próximos Passos</Title>
            
            <Group gap="md" justify="center">
              {orderConfirmed && (
                <Button
                  onClick={handleViewOrder}
                  variant="filled"
                  color="blue"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Ver Pedido
                </Button>
              )}
              
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                rightSection={<IconArrowRight size={16} />}
              >
                Continuar Comprando
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
