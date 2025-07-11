import { CollectionDetails } from "@localTypes/collection";
import { SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { CollectionAggregators } from "./CollectionAggregators";
import { CollectionInfoCard } from "./CollectionInfoCard";
import { CollectionStatus } from "./CollectionStatus";

export const CollectionInfoSection = ({
  collection,
}: {
  collection: CollectionDetails;
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);

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
  );
};
