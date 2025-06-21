"use client";

import type React from "react";

import {
  AppShell,
  Avatar,
  Burger,
  Divider,
  Group,
  Menu,
  NavLink,
  rem,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronRight,
  IconDashboard,
  IconFolder,
  IconLogout,
  IconPackage,
  IconReportAnalytics,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import { getInitials } from "@utils/getInitials";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
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
            <Group>
              <IconPackage size={24} color="var(--mantine-color-blue-6)" />
              <Title order={4}>Estoque Pro</Title>
            </Group>
          </Group>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap={7}>
                  <Avatar color="blue" radius="xl">
                    {getInitials(user.name)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
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
        <AppShell.Section>
          <Title order={5} mb="md">
            Menu Principal
          </Title>
        </AppShell.Section>
        <Divider mb="sm" />
        <AppShell.Section grow>
          <NavLink
            component={Link}
            to="/dashboard"
            label="Dashboard"
            leftSection={<IconDashboard size="1.2rem" />}
            rightSection={<IconChevronRight size="0.8rem" />}
            active={isActive("/dashboard")}
          />
          <NavLink
            component={Link}
            to="/products"
            label="Produtos"
            leftSection={<IconShoppingCart size="1.2rem" />}
            rightSection={<IconChevronRight size="0.8rem" />}
            active={isActive("/products") || isActive("/products/new")}
          />
          <NavLink
            component={Link}
            to="/collections"
            label="Coleções"
            leftSection={<IconFolder size="1.2rem" />}
            rightSection={<IconChevronRight size="0.8rem" />}
            active={isActive("/collections") || isActive("/collections/new")}
          />
          <NavLink
            component={Link}
            to="/reports"
            label="Relatórios"
            leftSection={<IconReportAnalytics size="1.2rem" />}
            rightSection={<IconChevronRight size="0.8rem" />}
            active={isActive("/reports")}
          />
        </AppShell.Section>

        <AppShell.Section>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Sistema de Estoque v1.0
            </Text>
            <Text size="xs" c="dimmed">
              © 2024
            </Text>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
