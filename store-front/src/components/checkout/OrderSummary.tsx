import { useCart } from "@contexts/cart-context";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconMinus, IconPlus, IconShoppingBagCheck, IconTrash } from "@tabler/icons-react";
import { formatPrice } from "@utils/formatPrice";

export function OrderSummary() {
  const { items, getTotalPrice, updateQuantity, removeItem } = useCart();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  
  const handleFinalizePurchase = () => {
    // Implementar lógica de finalização da compra
    console.log("Finalizando compra...");
  };

  const handleQuantityChange = (publicId: string, newQuantity: number) => {
    updateQuantity(publicId, newQuantity);
  };

  const handleRemoveItem = (publicId: string, itemName: string) => {
    modals.openConfirmModal({
      centered: true,
      title: "Remover item",
      children: `Tem certeza que deseja remover "${itemName}" do carrinho?`,
      labels: { confirm: "Sim, remover", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "outline" },
      onConfirm: () => {
        removeItem(publicId);
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
              <Group key={item.publicId} align="start" wrap="nowrap">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  w={100}
                  h={100}
                  radius="sm"
                  style={{ objectFit: "cover", flexShrink: 0 }}
                />

                <Stack gap={4} style={{ flex: 1 }}>
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
                      styles={(theme) => ({
                        label: {
                          color: isDark ? theme.black : theme.white,
                        },
                      })}
                    >
                      {item.size}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    Preço unitário: {formatPrice(item.price)}
                  </Text>

                  <Group gap="xs">
                    <ActionIcon
                      size="xs"
                      variant="light"
                      onClick={() => handleQuantityChange(item.publicId, item.quantity - 1)}
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
                      onClick={() => handleQuantityChange(item.publicId, item.quantity + 1)}
                    >
                      <IconPlus size={18} />
                    </ActionIcon>
                  </Group>
                </Stack>

                <Stack gap={4} align="flex-end">
                  <Text fw={600} size="sm">
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveItem(item.publicId, item.name)}
                    title="Remover"
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Stack>
              </Group>
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
        onClick={handleFinalizePurchase}
        style={{ marginTop: rem(16) }}
        disabled={items.length === 0}
      >
        Finalizar Compra
      </Button>
    </Stack>
  );
}
