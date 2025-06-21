import { AppShellLayout } from "@components/AppShell";
import {
  CollectionEmptyState,
  CollectionGrid,
  CollectionSearch,
} from "@components/collection";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { fetchCollections } from "@services/collection.service";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShellLayout>
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

        <CollectionSearch searchTerm={searchTerm} onSearch={setSearchTerm} />

        {filteredCollections.length > 0 ? (
          <CollectionGrid collections={filteredCollections} />
        ) : (
          <CollectionEmptyState
            showReset={!!searchTerm}
            onResetSearch={() => setSearchTerm("")}
          />
        )}
      </Container>
    </AppShellLayout>
  );
}
