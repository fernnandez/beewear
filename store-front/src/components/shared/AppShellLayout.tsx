import { AuthModal } from "@components/auth/authModal";
import { useAuth } from "@contexts/auth-context";
import {
  ActionIcon,
  AppShell,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Indicator,
  Menu,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconLogin,
  IconLogout,
  IconMinus,
  IconMoon,
  IconPlus,
  IconSettings,
  IconShoppingCart,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
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
  const isMinScreen = useMediaQuery("(max-width: 480px)");
  const { isAutenticated, logout } = useAuth();

  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  const isDark = colorScheme === "dark";

  const [cartOpened, { open: openCart, close: closeCart }] =
    useDisclosure(false);

  const [authOpened, { open: openAuth, close: closeAuth }] =
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

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header
        style={{
          borderBottom: isDark ? "1px solid #212529" : "1px solid #f8f9fa",
        }}
      >
        <Group justify="space-between" h={"100%"} px={"md"}>
          <UnstyledButton component={Link} to="/">
            <Group>
              <Image w={30} src={"/favicon.svg"} />
              <Title order={4} fw={700} c={isDark ? "white" : "dark"}>
                Beewear
              </Title>
            </Group>
          </UnstyledButton>

          <Group gap="lg">
            {colorScheme === "dark" ? (
              <ActionIcon
                size={isMinScreen ? "md" : "xl"}
                variant="transparent"
                color="yellow"
                onClick={() => setColorScheme("light")}
              >
                <IconSun size="1.5rem" />
              </ActionIcon>
            ) : (
              <ActionIcon
                size={isMinScreen ? "md" : "xl"}
                variant="transparent"
                color="dark"
                onClick={() => setColorScheme("dark")}
              >
                <IconMoon size="1.5rem" />
              </ActionIcon>
            )}

            <Indicator
              inline
              size={25}
              offset={-1}
              position="bottom-end"
              withBorder
              // label={0}
              color="yellow"
              // size={isMinScreen ? 12 : "sm"}
            >
              <ActionIcon
                size={isMinScreen ? "md" : "xl"}
                p={4}
                variant="light"
                color="yellow"
                radius="md"
                onClick={openCart}
                style={{ display: "flex", justifyContent: "center", flex: 1 }}
              >
                <IconShoppingCart stroke={1.5} />
              </ActionIcon>
            </Indicator>

            {!isAutenticated ? (
              <Button
                variant="subtle"
                color={isDark ? "white" : "dark"}
                size={isMinScreen ? "xs" : "md"}
                leftSection={<IconLogin size={16} />}
                onClick={openAuth}
              >
                Entrar
              </Button>
            ) : (
              <Menu>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color={isDark ? "white" : "dark"}
                    size={isMinScreen ? "xs" : "md"}
                    leftSection={<IconUser size={16} />}
                  >
                    Perfil
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings size={14} />}
                    component={Link}
                    to="/account"
                  >
                    Meus dados
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={logout}
                  >
                    Sair
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main
        style={{ backgroundColor: isDark ? "#212529" : "#f8f9fa" }}
      >
        {children}
      </AppShell.Main>

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
            >
              Finalizar Compra
            </Button>
          </Stack>
        )}
      </Modal>

      <AuthModal opened={authOpened} onClose={closeAuth} />
    </AppShell>
  );
};
