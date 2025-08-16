import { useAuth } from "@contexts/auth-context";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronRight,
  IconCreditCard,
  IconEdit,
  IconMail,
  IconMapPin,
  IconPackage,
  IconShield,
} from "@tabler/icons-react";
import { DARK_BORDER_COLOR, DARK_COLOR } from "@utils/constants";
import { useNavigate } from "react-router";

const quickActions = [
  {
    title: "Meus Endereços",
    description: "Gerencie endereços de entrega",
    icon: IconMapPin,
    color: "green",
    href: "#addresses",
  },
  {
    title: "Histórico de Pedidos",
    description: "Veja todos os seus pedidos",
    icon: IconPackage,
    color: "orange",
    href: "/account/orders",
  },
  {
    title: "Segurança",
    description: "Senha e autenticação",
    icon: IconShield,
    color: "violet",
    href: "#security",
  },
  {
    title: "Formas de pagamento",
    description: "Veja toas as formas cadastradas",
    icon: IconCreditCard,
    color: "blue",
    href: "#security",
  },
];

export default function Account() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleActionClick = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href);
    } else {
      // Para links internos (#), você pode implementar scroll ou outras ações
      console.log("Ação interna:", href);
    }
  };

  return (
    <Container size="xl" mt="xl" mb="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/")}
            >
              Voltar
            </Button>
          </Group>
        </Group>

        <Card
          shadow="md"
          p="xl"
          mb="xl"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? DARK_COLOR : "white",
          }}
        >
          <Flex justify="space-between" gap={"md"}>
            <div>
              <Title order={2} mb="xs" c={isDark ? "white" : "dark"}>
                {user?.name}
              </Title>
              <Group gap="xs" mb="xs">
                <IconMail size={16} />
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
              </Group>
            </div>
            <ActionIcon size="lg" variant="light" radius="md">
              <IconEdit size={18} />
            </ActionIcon>
          </Flex>
        </Card>
        <Grid>
          {/* Quick Actions */}
          <Grid.Col span={{ base: 12 }}>
            <Card
              shadow="md"
              p="lg"
              radius="lg"
              mb="xl"
              withBorder
              style={{
                backgroundColor: isDark ? DARK_COLOR : "white",
              }}
            >
              <Title order={3} c={isDark ? "white" : "dark"}>
                Ações Rápidas
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                {quickActions.map((action) => (
                  <Paper
                    key={action.title}
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: isDark ? DARK_BORDER_COLOR : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      // border: "1px solid #edededff",
                    }}
                    styles={{
                      root: {
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                      },
                    }}
                    onClick={() => handleActionClick(action.href)}
                  >
                    <Group mb="xs">
                      <ThemeIcon
                        size="md"
                        variant="light"
                        color={action.color}
                        radius="md"
                      >
                        <action.icon size={16} />
                      </ThemeIcon>
                      <IconChevronRight
                        size={14}
                        style={{ marginLeft: "auto" }}
                      />
                    </Group>
                    <Text fw={500} size="sm" mb="xs">
                      {action.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {action.description}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
