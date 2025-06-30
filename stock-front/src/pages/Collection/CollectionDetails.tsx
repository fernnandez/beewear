import { AppShellLayout } from "@components/AppShell";
import {
  CollectionAggregators,
  CollectionImageCard,
  CollectionInfoCard,
  CollectionProductsTable,
  CollectionStatus,
} from "@components/collection";
import { Button, Container, Group, SimpleGrid, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchCollectionDetails } from "@services/collection.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CollectionDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const { data: collection, isLoading } = useQuery({
    queryKey: ["collection-details", publicId],
    queryFn: () => fetchCollectionDetails(publicId!),
    enabled: !!publicId,
  });

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Nome é obrigatório" : null,
    },
  });

  useEffect(() => {
    if (collection) {
      form.setValues({
        name: collection.name,
        description: collection.description ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  if (!collection || isLoading) {
    return (
      <AppShellLayout>
        <Container size="xl">
          <Text>Carregando detalhes da coleção...</Text>
        </Container>
      </AppShellLayout>
    );
  }

  const handleStartEdit = () => {
    form.setValues({
      name: collection.name,
      description: collection.description,
    });
    setIsEditingInfo(true);
  };

  const handleCancelEdit = () => {
    form.setValues({
      name: collection.name,
      description: collection.description,
    });
    setIsEditingInfo(false);
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Button variant="subtle" onClick={() => navigate("/collections")}>
              ← Voltar
            </Button>
          </div>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="xl">
          <div style={{ gridColumn: "span 2" }}>
            <CollectionInfoCard
              collection={collection}
              form={form}
              isEditing={isEditingInfo}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
            />

            <CollectionStatus
              name={collection.name}
              isEditingInfo={isEditingInfo}
              isActive={collection.active}
              publicId={collection.publicId}
            />
          </div>
          <CollectionAggregators aggregations={collection.aggregations} />
        </SimpleGrid>

        <CollectionImageCard
          collectionName={collection.name}
          collectionImageUrl={collection.imageUrl || null}
        />

        <CollectionProductsTable products={collection.products} />
      </Container>
    </AppShellLayout>
  );
}
