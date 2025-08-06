import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Radio,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconCreditCard,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface PaymentMethod {
  id: string;
  type: "card" | "pix" | "bank_transfer";
  name: string;
  lastFour?: string;
  brand?: string;
  isDefault: boolean;
}

interface PaymentSectionProps {
  selectedPayment: string;
  onPaymentSelect: (paymentId: string) => void;
}

export function PaymentSection({ selectedPayment, onPaymentSelect }: PaymentSectionProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Cartão Principal",
      lastFour: "1234",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "Cartão Secundário",
      lastFour: "5678",
      brand: "Mastercard",
      isDefault: false,
    },
    {
      id: "3",
      type: "pix",
      name: "PIX",
      isDefault: false,
    },
  ]);

  // Selecionar o método de pagamento padrão por padrão
  useEffect(() => {
    const defaultPayment = paymentMethods.find((pay) => pay.isDefault);
    if (defaultPayment && !selectedPayment) {
      onPaymentSelect(defaultPayment.id);
    }
  }, [paymentMethods, selectedPayment, onPaymentSelect]);

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pay) => pay.id !== id));
    if (selectedPayment === id) {
      onPaymentSelect("");
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card":
        return <IconCreditCard size={20} />;
      case "pix":
        return (
          <Text size="sm" fw={600}>
            PIX
          </Text>
        );
      case "bank_transfer":
        return (
          <Text size="sm" fw={600}>
            Transferência
          </Text>
        );
      default:
        return <IconCreditCard size={20} />;
    }
  };

  const getPaymentDisplayName = (payment: PaymentMethod) => {
    if (payment.type === "card") {
      return `${payment.brand} •••• ${payment.lastFour}`;
    }
    return payment.name;
  };

  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
        backgroundColor: isDark ? "#212529" : "white",
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={2} fw={700} size={rem(24)}>
          Meus Métodos de Pagamento
        </Title>
        <Button leftSection={<IconPlus size={16} />} size="sm" color="dark">
          Adicionar
        </Button>
      </Group>

      <Text size="sm" c="dimmed" mb="lg">
        Selecione um método de pagamento *
      </Text>

      {paymentMethods.length === 0 ? (
        <Box
          p="xl"
          style={{
            border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
            borderRadius: rem(8),
            backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
          }}
        >
          <Text ta="center" c="dimmed">
            Nenhum método de pagamento cadastrado
          </Text>
        </Box>
      ) : (
        <Stack gap="md">
          {paymentMethods.map((payment) => (
            <Box
              key={payment.id}
              p="md"
              style={{
                border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                borderRadius: rem(8),
                backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                  <Radio
                    value={payment.id}
                    checked={selectedPayment === payment.id}
                    onChange={(event) =>
                      onPaymentSelect(event.currentTarget.value)
                    }
                    label=""
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text fw={600} size="sm">
                        {payment.name}
                      </Text>
                      {payment.isDefault && (
                        <Text size="xs" c="dimmed">
                          (Padrão)
                        </Text>
                      )}
                    </Group>
                    <Group gap="xs" align="center">
                      {getPaymentIcon(payment.type)}
                      <Text size="sm" c="dimmed">
                        {getPaymentDisplayName(payment)}
                      </Text>
                    </Group>
                  </Stack>
                </Group>

                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="dark"
                    title="Editar"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    title="Excluir"
                    onClick={() => handleDeletePayment(payment.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
