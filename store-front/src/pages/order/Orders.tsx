import {
  getPaymentMethodText,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  useOrders,
} from "@hooks/useOrders";
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCreditCard,
  IconPackage,
} from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";
import { useNavigate } from "react-router";
import { formatPrice } from "../../utils/formatPrice";

export function Orders() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();

  const { data: orders, isLoading: loading, error, refetch } = useOrders();

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Erro ao carregar pedidos"
          color="red"
          variant="light"
        >
          {error.message}
        </Alert>
        <Center mt="md">
          <Button onClick={() => refetch()} variant="outline">
            Tentar Novamente
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/account")}
            >
              Voltar
            </Button>
          </Group>
        </Group>

        {/* Orders List */}
        {orders?.length === 0 ? (
          <Card
            p="xl"
            radius="md"
            ta="center"
            style={{
              border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
              backgroundColor: isDark ? "#212529" : "white",
            }}
          >
            <IconPackage size={48} color="var(--mantine-color-gray-5)" />
            <Title order={3} mt="md" c="dimmed">
              Nenhum pedido encontrado
            </Title>
            <Text c="dimmed" mt="xs">
              Você ainda não fez nenhum pedido. Que tal começar a comprar?
            </Text>
            <Button
              mt="md"
              onClick={() => navigate("/")}
              leftSection={<IconPackage size={16} />}
            >
              Ver Produtos
            </Button>
          </Card>
        ) : (
          <Stack gap="md">
            {orders?.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Paper
                  key={order.publicId}
                  p="lg"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? DARK_COLOR : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                  onClick={() => navigate(`/account/orders/${order.publicId}`)}
                >
                  <Group justify="space-between" align="start">
                    <Stack gap="sm" style={{ flex: 1 }}>
                      <Group gap="md" align="center">
                        <Badge
                          size="lg"
                          color={getStatusColor(order.status)}
                          variant="light"
                          leftSection={<StatusIcon size={12} />}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                        <Text size="sm" c="dimmed" ff="monospace">
                          #{order.publicId.slice(0, 8).toUpperCase()}
                        </Text>
                      </Group>

                      <Group gap="lg">
                        <Group gap="xs">
                          <IconCalendar
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </Text>
                        </Group>

                        <Group gap="xs">
                          <IconPackage
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {order.totalItems} item
                            {order.totalItems !== 1 ? "s" : ""}
                          </Text>
                        </Group>

                        <Group gap="xs">
                          <IconCreditCard
                            size={16}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {getPaymentMethodText(order.paymentMethodType)}
                          </Text>
                        </Group>
                      </Group>
                    </Stack>

                    <Stack gap="xs" align="end">
                      <Text fw={700} size="lg">
                        {formatPrice(order.totalAmount)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {order.paymentStatus}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
