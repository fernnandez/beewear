import {
  getPaymentMethodIcon,
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
  Select,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconFilter,
  IconPackage,
} from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";
import { ORDER_STATUS_FILTER_OPTIONS, getPaymentStatusInfo } from "@utils/status-mapper";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { formatPrice } from "../../utils/formatPrice";

export function Orders() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");

  const {
    data: orders,
    isLoading: loading,
    error,
    refetch,
  } = useOrders();

  // Filtrar pedidos localmente baseado no status selecionado
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!statusFilter) return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

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
            <Title order={2}>Os Meus Pedidos</Title>
          </Group>
        </Group>

        {/* Filter Section */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
          <Group gap="md" align="center">
            <IconFilter size={20} color="var(--mantine-color-gray-6)" />
            <Text size="sm" fw={500}>
              Filtrar por estado:
            </Text>
            <Select
              placeholder="Todos os estados"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || "")}
              data={ORDER_STATUS_FILTER_OPTIONS}
              clearable
              style={{ minWidth: 200 }}
              size="sm"
            />
            {statusFilter && (
              <Text size="sm" c="dimmed">
                {filteredOrders?.length || 0} pedido(s) encontrado(s)
              </Text>
            )}
          </Group>
        </Paper>


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
              Ainda não fez nenhum pedido. Que tal começar a comprar?
            </Text>
            <Button
              mt="md"
              onClick={() => navigate("/")}
              leftSection={<IconPackage size={16} />}
            >
              Ver Produtos
            </Button>
          </Card>
        ) : filteredOrders?.length === 0 ? (
          <Card
            p="xl"
            radius="md"
            ta="center"
            style={{
              border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
              backgroundColor: isDark ? "#212529" : "white",
            }}
          >
            <IconFilter size={48} color="var(--mantine-color-gray-5)" />
            <Title order={3} mt="md" c="dimmed">
              Nenhum pedido encontrado
            </Title>
            <Text c="dimmed" mt="xs">
              Não há pedidos com o estado selecionado.
            </Text>
            <Button
              mt="md"
              variant="outline"
              onClick={() => setStatusFilter("")}
            >
              Limpar Filtro
            </Button>
          </Card>
        ) : (
          <Stack gap="md">
            {filteredOrders?.map((order) => {
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
                          <span style={{ fontSize: "1.2em" }}>
                            {getPaymentMethodIcon(order.paymentMethodType)}
                          </span>
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
                        {getPaymentStatusInfo(order.paymentStatus).label}
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
