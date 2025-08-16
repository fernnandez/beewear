import { useMantineColorScheme, Paper, Stack, Title, rem, Box, Group, Alert, Text } from "@mantine/core";
import { IconCreditCard, IconInfoCircle } from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";

export function PaymentSection() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Paper p="xl" radius="md" style={{backgroundColor: isDark ? DARK_COLOR : "#FFFFFF"}}>
      <Stack gap="lg">
        <Title order={2} fw={700} size={rem(24)}>
          Método de Pagamento
        </Title>

        <Text size="sm" c="dimmed">
          Seu pagamento será processado de forma segura pela Stripe
        </Text>

        {/* Método Único Simplificado */}
        <Box p="md" style={{backgroundColor: isDark ? DARK_COLOR : "#FFFFFF"}}>
          <Group gap="md" align="center">
            <IconCreditCard size={24} />
            <Stack gap={4}>
              <Text fw={600} size="sm">
                Métodos de Pagamento
              </Text>
              <Text size="xs" c="dimmed">
                Configurados automaticamente pela Stripe
              </Text>
            </Stack>
          </Group>
        </Box>

        {/* Info Alert */}
        <Alert icon={<IconInfoCircle size={16} />} title="Pagamento Seguro" color="blue" variant="light">
          <Text size="sm">
            Seus dados de pagamento são criptografados e processados pela Stripe.
          </Text>
        </Alert>
      </Stack>
    </Paper>
  );
}