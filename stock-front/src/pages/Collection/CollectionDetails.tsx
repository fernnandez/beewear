import { AppShellLayout } from "@components/AppShell";
import {
  CollectionAggregators,
  CollectionDetailsHeader,
  CollectionImageCard,
  CollectionInfoCard,
  CollectionProductsTable,
} from "@components/collection";
import { Container, SimpleGrid, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { fetchCollectionDetails } from "@services/collection.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CollectionDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const { data: collection, isLoading } = useQuery({
    queryKey: ["collection-details", publicId],
    queryFn: () => fetchCollectionDetails(publicId!),
    enabled: !!publicId,
  });

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      isActive: false,
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
        isActive: collection.active,
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

  const handleSave = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setIsEditing(false);
      notifications.show({
        title: "Coleção atualizada",
        message: "As informações foram salvas com sucesso",
        color: "green",
      });
    }
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <CollectionDetailsHeader
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
          onBack={() => navigate("/collections")}
        />

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="xl">
          <div style={{ gridColumn: "span 2" }}>
            <CollectionInfoCard
              isEditing={isEditing}
              collection={collection}
              form={form}
            />
          </div>
          <CollectionAggregators aggregations={collection.aggregations} />
        </SimpleGrid>

        <CollectionImageCard collectionName={collection.name} />

        <CollectionProductsTable products={collection.products} />
      </Container>
    </AppShellLayout>
  );
}
