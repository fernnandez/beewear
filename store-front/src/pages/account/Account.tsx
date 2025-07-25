import {
  ActionIcon,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconChevronRight,
  IconCreditCard,
  IconEdit,
  IconMail,
  IconMapPin,
  IconPackage,
  IconShield,
} from "@tabler/icons-react";

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
    href: "#orders",
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
  return (
    <Container size="xl" mt="xl" mb="xl">
      <Paper shadow="md" p="xl" mb="xl" radius="lg">
        <Flex justify="space-between" gap={"md"}>
          <div>
            <Title order={2} mb="xs">
              Maria Silva
            </Title>
            <Group gap="xs" mb="xs">
              <IconMail size={16} />
              <Text size="sm" c="dimmed">
                maria.silva@email.com
              </Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={16} />
              <Text size="sm" c="dimmed">
                Cliente desde Janeiro 2023
              </Text>
            </Group>
          </div>
          <ActionIcon size="lg" variant="light">
            <IconEdit size={18} />
          </ActionIcon>
        </Flex>
      </Paper>
      <Grid>
        {/* Quick Actions */}
        <Grid.Col span={{ base: 12 }}>
          <Card shadow="sm" p="lg" radius="lg" mb="xl">
            <Title order={3}>Ações Rápidas</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
              {quickActions.map((action) => (
                <Paper
                  key={action.title}
                  p="md"
                  radius="md"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: "1px solid #e9ecef",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                >
                  <Group mb="xs">
                    <ThemeIcon size="md" variant="light" color={action.color}>
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
    </Container>
  );
}
