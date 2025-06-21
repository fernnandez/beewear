import { AppShellLayout } from "@components/AppShell";
import {
  CollectionEmptyState,
  CollectionGrid,
  CollectionHeader,
  CollectionSearch,
} from "@components/collection";
import { Container } from "@mantine/core";
import { fetchCollections } from "@services/collection.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
        <CollectionHeader />

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
