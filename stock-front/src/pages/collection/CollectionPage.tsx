import { CollectionList } from "@components/collection/CollectionList/CollectionList";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { fetchCollections } from "@services/collection.service";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function CollectionsPage() {
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  return (
    <Container size="xl">
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

      <CollectionList collections={collections} />
    </Container>
  );
}
