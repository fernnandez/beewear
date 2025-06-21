import { AppShellLayout } from "@components/AppShell";
import { NewProductForm } from "@components/product/NewProductForm";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function NewProductPage() {
  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2} mb="md">
              Novo Produto
            </Title>
            <Text c="dimmed">Crie um novo produto com variações</Text>
          </div>
          <Button
            variant="light"
            component={Link}
            to="/products"
            leftSection={<IconArrowBackUp size={16} />}
          >
            Produtos
          </Button>
        </Group>

        <NewProductForm />
      </Container>
    </AppShellLayout>
  );
}
