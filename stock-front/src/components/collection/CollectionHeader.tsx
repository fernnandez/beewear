import { Button, Group, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const CollectionHeader = () => (
  <Group justify="space-between" mb="xl">
    <div>
      <Title order={2}>Coleções</Title>
      <Text c="dimmed">Gerencie suas coleções de produtos</Text>
    </div>
    <Button
      component={Link}
      to="/collections/new"
      leftSection={<IconPlus size={16} />}
    >
      Nova Coleção
    </Button>
  </Group>
);
