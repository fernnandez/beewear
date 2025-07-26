import { AuthModal } from "@components/auth/AuthModal";
import { CartModal } from "@components/cart/CartModal";
import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import {
  ActionIcon,
  AppShell,
  Button,
  Group,
  Image,
  Indicator,
  Menu,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconLogin,
  IconLogout,
  IconMoon,
  IconSettings,
  IconShoppingCart,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { Link } from "react-router";

export const AppShellLayout = ({ children }: { children: React.ReactNode }) => {
  const { getTotalItems } = useCart();
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
              disabled={getTotalItems() === 0}
              label={getTotalItems().toString()}
              color="yellow"
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

      <AuthModal opened={authOpened} onClose={closeAuth} />
      <CartModal opened={cartOpened} onClose={closeCart} />
    </AppShell>
  );
};
