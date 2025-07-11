import { Collection } from "@localTypes/collection";
import { useState } from "react";
import { CollectionEmptyState } from "./CollectionEmptyState";
import { CollectionGrid } from "./CollectionGrid";
import { CollectionSearch } from "./CollectionSearch";

export const CollectionList = ({
  collections,
}: {
  collections: Collection[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <CollectionSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
      {filteredCollections.length > 0 ? (
        <CollectionGrid collections={filteredCollections} />
      ) : (
        <CollectionEmptyState
          showReset={!!searchTerm}
          onResetSearch={() => setSearchTerm("")}
        />
      )}
    </>
  );
};
