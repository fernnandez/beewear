import { useCart } from "@contexts/cart-context";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconMinus,
  IconPlus,
  IconShoppingBagCheck,
  IconTrash,
} from "@tabler/icons-react";
import { formatPrice } from "@utils/formatPrice";
import { useNavigate } from "react-router";

interface OrderSummaryProps {
  isCheckoutComplete: boolean;
}

export function OrderSummary({ isCheckoutComplete }: OrderSummaryProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();

  const { items, getTotalPrice, updateQuantity, removeItem } = useCart();

  const handleConfirmOrder = async () => {
    navigate("/checkout/order-review");
  };

  const handleQuantityChange = (
    productVariationSizePublicId: string,
    newQuantity: number
  ) => {
    updateQuantity(productVariationSizePublicId, newQuantity);
  };

  const handleRemoveItem = (
    productVariationSizePublicId: string,
    itemName: string
  ) => {
    modals.openConfirmModal({
      centered: true,
      title: "Remover item",
      children: `Tem certeza que deseja remover "${itemName}" do pedido?`,
      labels: { confirm: "Sim, remover", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "outline" },
      onConfirm: () => {
        removeItem(productVariationSizePublicId);
      },
    });
  };

  return (
    <Stack gap="lg">
      <Title order={2} fw={700} size={rem(24)}>
        Resumo do Pedido
      </Title>

      {/* Items */}
      {items.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          Nenhum item no carrinho
        </Text>
      ) : (
        <>
          <Stack gap="md">
            {items.map((item) => (
              <Paper
                key={item.productVariationSizePublicId}
                p="sm"
                style={{
                  border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                  borderRadius: rem(8),
                  backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                }}
              >
                <Stack gap="sm">
                  <Group align="start" wrap="nowrap">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      w={{ base: 80, sm: 100 }}
                      h={{ base: 80, sm: 100 }}
                      radius="sm"
                      style={{ objectFit: "cover", flexShrink: 0 }}
                    />

                    <Stack gap={6} style={{ flex: 1 }}>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {item.name}
                      </Text>
                      <Group gap={"xs"}>
                        <Box
                          key={item.color}
                          w={20}
                          h={20}
                          style={{
                            backgroundColor: item.color,
                            borderRadius: "50%",
                          }}
                        />
                        <Badge
                          size="sm"
                          color={isDark ? "white" : "dark"}
                          variant="outline"
                        >
                          {item.size}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {formatPrice(item.price)}
                      </Text>

                      <Group gap="xs">
                        <ActionIcon
                          size="xs"
                          variant="light"
                          onClick={() =>
                            handleQuantityChange(
                              item.productVariationSizePublicId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <IconMinus size={14} />
                        </ActionIcon>
                        <Text size="sm" fw={500} w={20} ta="center">
                          {item.quantity}
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="light"
                          onClick={() =>
                            handleQuantityChange(
                              item.productVariationSizePublicId,
                              item.quantity + 1
                            )
                          }
                        >
                          <IconPlus size={18} />
                        </ActionIcon>
                      </Group>
                    </Stack>

                    <Stack align="flex-end" justify="space-between" h="100%">
                      <Text fw={600} size="sm">
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          handleRemoveItem(
                            item.productVariationSizePublicId,
                            item.name
                          )
                        }
                        title="Remover"
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Divider />
        </>
      )}

      {/* Total */}
      <Group justify="space-between">
        <Text size="md" fw={600}>
          Total:
        </Text>
        <Text size="lg" fw={700}>
          {formatPrice(getTotalPrice())}
        </Text>
      </Group>

      {/* Finalize Button */}
      <Button
        leftSection={<IconShoppingBagCheck size={16} />}
        size="md"
        color="dark"
        fullWidth
        onClick={handleConfirmOrder}
        style={{ marginTop: rem(16) }}
        disabled={items.length === 0 || !isCheckoutComplete}
      >
        Finalizar Compra
      </Button>
    </Stack>
  );
}
