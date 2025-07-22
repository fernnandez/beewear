import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Indicator,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMinus, IconPlus, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export const AppShellLayout = ({ children }: { children: React.ReactNode }) => {
  const [cartOpened, { open: openCart, close: closeCart }] =
    useDisclosure(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const removeFromCart = (id: number, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    id: number,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header style={{ borderBottom: "1px solid #f1f3f4" }}>
        <Group justify="space-between" p={"md"}>
          <UnstyledButton component={Link} to="/">
            <Group>
              <Image w={30} src={"/favicon.svg"} />
              <Title order={4} fw={700} c="dark">
                Beewear
              </Title>
            </Group>
          </UnstyledButton>

          <Group gap="lg">
            <Button variant="subtle" color="dark" size="sm">
              Pedidos
            </Button>
            <Indicator
              label={getTotalItems()}
              disabled={getTotalItems() === 0}
              color="yellow"
              size={16}
            >
              <ActionIcon variant="subtle" color="dark" onClick={openCart}>
                <IconShoppingCart size={18} />
              </ActionIcon>
            </Indicator>
            <ActionIcon variant="subtle" color="dark">
              <Avatar size={28} color="dark" />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      {/* Cart Modal */}
      <Modal
        opened={cartOpened}
        onClose={closeCart}
        title="Carrinho"
        size="md"
        radius="sm"
      >
        {cart.length === 0 ? (
          <Center py={40}>
            <Stack align="center" gap="md">
              <IconShoppingCart size={40} color="var(--mantine-color-gray-4)" />
              <Text c="dimmed">Carrinho vazio</Text>
              <Button variant="outline" color="dark" onClick={closeCart}>
                Continuar
              </Button>
            </Stack>
          </Center>
        ) : (
          <Stack gap="md">
            {cart.map((item) => (
              <Paper
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                p="md"
                radius="sm"
                withBorder
              >
                <Group align="start">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    width={60}
                    height={60}
                    radius="sm"
                    alt={item.name}
                  />
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={500} size="sm">
                      {item.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.selectedSize} • {item.selectedColor}
                    </Text>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="gray"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                        >
                          <IconMinus size={12} />
                        </ActionIcon>
                        <Text size="sm" w={20} ta="center">
                          {item.quantity}
                        </Text>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="gray"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                        >
                          <IconPlus size={12} />
                        </ActionIcon>
                      </Group>
                      <Text fw={600} size="sm">
                        €{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
              </Paper>
            ))}

            <Divider />

            <Group justify="space-between">
              <Text fw={600}>Total:</Text>
              <Text fw={700} size="lg">
                €{(999999.99).toFixed(2)}
              </Text>
            </Group>

            <Button
              fullWidth
              color="dark"
              radius="sm"
              onClick={() => {
                if (cart.length > 0) {
                  // Salvar carrinho no localStorage para usar no checkout
                  localStorage.setItem("beewear-cart", JSON.stringify(cart));
                  window.location.href = "/checkout";
                }
              }}
              disabled={cart.length === 0}
            >
              Finalizar Compra
            </Button>
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
};
