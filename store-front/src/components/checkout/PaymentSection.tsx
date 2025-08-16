import {
  Alert,
  Box,
  Group,
  LoadingOverlay,
  Paper,
  Radio,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconInfoCircle, IconCreditCard } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import paymentService, { PaymentMethod } from "@services/payment.service";

interface PaymentSectionProps {
  selectedPayment: string;
  onPaymentSelect: (paymentId: string) => void;
}

export function PaymentSection({
  selectedPayment,
  onPaymentSelect,
}: PaymentSectionProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar métodos de pagamento disponíveis
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const methods = await paymentService.getAvailablePaymentMethods();
      setPaymentMethods(methods);

      // Selecionar cartão de crédito por padrão se nenhum estiver selecionado
      if (methods.length > 0 && !selectedPayment) {
        const defaultMethod = methods.find((m) => m.isActive) || methods[0];
        onPaymentSelect(defaultMethod.id);
      }
    } catch (err) {
      setError("Erro ao carregar métodos de pagamento");
      console.error("Erro ao carregar métodos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    if (method.icon === "💳") {
      return <IconCreditCard size={24} />;
    }
    return <span style={{ fontSize: "24px" }}>{method.icon}</span>;
  };

  if (isLoading) {
    return (
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
        <Text ta="center">Carregando métodos de pagamento...</Text>
      </Paper>
    );
  }

  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
        backgroundColor: isDark ? "#212529" : "white",
      }}
    >
      <Stack gap="lg">
        <Title order={2} fw={700} size={rem(24)}>
          Método de Pagamento
        </Title>

        <Text size="sm" c="dimmed">
          Seu pagamento será processado de forma segura pela Stripe
        </Text>

        {error ? (
          <Alert color="red" title="Erro" variant="light">
            <Text size="sm">{error}</Text>
          </Alert>
        ) : (
          <>
            {/* Métodos de Pagamento Disponíveis */}
            <Stack gap="md">
              {paymentMethods
                .filter((method) => method.isActive) // Mostrar apenas métodos ativos
                .map((method) => (
                  <Box
                    key={method.id}
                    p="md"
                    style={{
                      border: isDark
                        ? "1px solid #212529"
                        : "1px solid #e9ecef",
                      borderRadius: rem(8),
                      backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                      cursor: "pointer",
                    }}
                    onClick={() => onPaymentSelect(method.id)}
                  >
                    <Group gap="md" align="center">
                      <Radio
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => onPaymentSelect(method.id)}
                        label=""
                      />
                      <Group gap="sm" align="center">
                        {getPaymentIcon(method)}
                        <Stack gap={4}>
                          <Text fw={600} size="sm">
                            {method.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {method.description}
                          </Text>
                        </Stack>
                      </Group>
                    </Group>
                  </Box>
                ))}
            </Stack>

            {/* Info Alert */}
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Pagamento Seguro"
              color="blue"
              variant="light"
            >
              <Text size="sm">
                Seus dados de pagamento são criptografados e processados pela
                Stripe, uma das plataformas de pagamento mais seguras do mundo.
                Não armazenamos informações do seu cartão.
              </Text>
            </Alert>

            {/* Informações sobre cartão */}
            <Box
              p="md"
              style={{
                border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                borderRadius: rem(8),
                backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
              }}
            >
              <Stack gap="sm">
                <Text fw={600} size="sm">
                  💳 Cartões Aceitos:
                </Text>
                <Text size="sm" c="dimmed">
                  Visa, Mastercard, American Express e outros cartões de crédito
                </Text>
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}
