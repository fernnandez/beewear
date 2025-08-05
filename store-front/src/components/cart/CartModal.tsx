import { useCart } from "@contexts/cart-context";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconMinus,
  IconPlus,
  IconShoppingBagCheck,
  IconShoppingCart,
  IconTrash,
} from "@tabler/icons-react";
import { formatPrice } from "../../utils/formatPrice";

interface CartModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CartModal({ opened, onClose }: CartModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  const isEmpty = items.length === 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Seu carrinho"
      size="lg"
      centered
      radius="md"
      //   padding="lg"
      styles={{
        header: {
          borderBottom: "1px solid #e9ecef",
        },
        title: {
          fontSize: rem(20),
          fontWeight: 700,
        },
      }}
    >
      {isEmpty ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} variant="light" color="gray">
              <IconShoppingCart size={40} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" ta="center">
              Seu carrinho está vazio
            </Text>
            <Button onClick={onClose} variant="outline">
              Continuar comprando
            </Button>
          </Stack>
        </Center>
      ) : (
        <Stack gap="lg">
          <Stack gap="md" px="sm" style={{ maxHeight: 400, overflowY: "auto" }}>
            {items.map((item) => (
              <Group key={item.publicId} align="start" wrap="nowrap" mt="md">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  w={60}
                  h={60}
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
                          color: isDark ? theme.black : theme.white, // ou qualquer cor que desejar
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
                      onClick={() =>
                        updateQuantity(item.publicId, item.quantity - 1)
                      }
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
                        updateQuantity(item.publicId, item.quantity + 1)
                      }
                    >
                      <IconPlus size={18} />
                    </ActionIcon>
                  </Group>
                </Stack>

                <Stack gap={4} align="flex-end">
                  <Text fw={600} size="sm">
                    €{(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => removeItem(item.publicId)}
                    title="Remover"
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Stack>
              </Group>
            ))}
          </Stack>

          <Divider />

          <Group justify="space-between" px="sm">
            <Text size="md" fw={600}>
              Total:
            </Text>
            <Text size="lg" fw={700}>
              €{getTotalPrice().toFixed(2)}
            </Text>
          </Group>

          <Button
            leftSection={<IconShoppingBagCheck size={16} />}
            size="md"
            color="dark"
            fullWidth
          >
            Finalizar compra
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
