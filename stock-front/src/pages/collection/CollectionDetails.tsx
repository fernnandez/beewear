import { CollectionPreview } from "@components/collection";
import { CollectionInfoSection } from "@components/collection/CollectionInfoSection/CollectionInfoSection";
import { Button, Container, Group, Text } from "@mantine/core";
import { fetchCollectionDetails } from "@services/collection.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function CollectionDetailPage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const { data: collection, isLoading } = useQuery({
    queryKey: ["collection-details", publicId],
    queryFn: () => fetchCollectionDetails(publicId!),
    enabled: !!publicId,
  });

  if (!collection || isLoading) {
    return (
      <Container size="xl">
        <Text>Carregando detalhes da coleção...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Button variant="light" onClick={() => navigate("/collections")}>
            ← Coleções
          </Button>
        </div>
      </Group>

      <CollectionInfoSection collection={collection} />

      <CollectionPreview
        name={collection.name}
        description={collection.description}
        image={collection.imageUrl || null}
      />
    </Container>
  );
}
