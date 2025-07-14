import type React from "react";

import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Divider,
  Group,
  Image,
  Menu,
  NavLink,
  rem,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconChevronRight,
  IconFolder,
  IconLogout,
  IconMoon,
  IconReportAnalytics,
  IconShoppingCart,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { getInitials } from "@utils/getInitials";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth-context";

interface AppShellLayoutProps {
  children: React.ReactNode;
}

export function AppShellLayout({ children }: AppShellLayoutProps) {
  const [opened, setOpened] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 210, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <UnstyledButton component={Link} to="/">
              <Group>
                <Image w={30} src={"/favicon.svg"} />
                <Title order={4}>Beewear Stock</Title>
              </Group>
            </UnstyledButton>
          </Group>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap={7}>
                  <Avatar color="yellow" radius="xl">
                    {getInitials(user.name)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="xs" fw={500}>
                      {user?.name}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {user?.email}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                disabled
                leftSection={
                  <IconUser style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Perfil
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={handleLogout}
                color="red"
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <NavLink
            component={Link}
            to="/reports"
            label="Relatórios"
            leftSection={<IconReportAnalytics size="1.5rem" />}
            rightSection={<IconChevronRight size="1rem" />}
            active={isActive("/reports")}
          />
          <NavLink
            component={Link}
            to="/products"
            label="Produtos"
            leftSection={<IconShoppingCart size="1.5rem" />}
            rightSection={<IconChevronRight size="1rem" />}
            active={isActive("/products") || isActive("/products/new")}
          />
          <NavLink
            component={Link}
            to="/collections"
            label="Coleções"
            leftSection={<IconFolder size="1.5rem" />}
            rightSection={<IconChevronRight size="1rem" />}
            active={isActive("/collections") || isActive("/collections/new")}
          />
        </AppShell.Section>

        <AppShell.Section>
          <Divider my="sm" />
          {colorScheme === "dark" ? (
            <Button
              fullWidth
              variant="default"
              onClick={() => setColorScheme("light")}
            >
              <IconSun size="1.5rem" />
            </Button>
          ) : (
            <Button
              fullWidth
              variant="default"
              onClick={() => setColorScheme("dark")}
            >
              <IconMoon size="1.5rem" />
            </Button>
          )}
        </AppShell.Section>

        <AppShell.Section>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Beewear Stock v1.0
            </Text>
            <Text size="xs" c="dimmed">
              © 2025
            </Text>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
