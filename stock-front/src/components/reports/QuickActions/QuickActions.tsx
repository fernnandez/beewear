import { Button, Card, rem, SimpleGrid, Text, Title } from "@mantine/core";
import { IconPackage, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb={"xl"}>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={4}>Ações Rápidas</Title>
        <Text size="sm" c="dimmed">
          Acesse rapidamente as principais funcionalidades
        </Text>
      </Card.Section>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
        <Button
          
          component={Link}
          to="/collections/new"
          variant="outline"
          h={rem(80)}
          leftSection={<IconPlus size={24} />}
        >
          Cadastrar Coleção
        </Button>
        <Button
          
          component={Link}
          to="/products/new"
          variant="outline"
          h={rem(80)}
          leftSection={<IconPlus size={24} />}
        >
          Cadastrar Produto
        </Button>
        <Button
          
          component={Link}
          to="/products"
          variant="outline"
          h={rem(80)}
          leftSection={<IconPackage size={24} />}
        >
          Gerenciar Estoque
        </Button>
      </SimpleGrid>
    </Card>
  );
};
