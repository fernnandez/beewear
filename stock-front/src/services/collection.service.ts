import type { Collection, CollectionDetails } from "src/types/collection";
import api from "./api";

interface CreateCollectionParams {
  name: string;
  description: string;
  active: boolean;
  //   imageUrl: string TODO: implementar upload de imagems
}

export const createCollection = async (
  createCollectionParams: CreateCollectionParams
): Promise<void> => {
  console.log(createCollectionParams);
  await api.post("/collection", createCollectionParams);
};

export const fetchCollections = async () => {
  const response = await api.get<Collection[]>("/collection");
  return response.data;
};

export const fetchCollectionDetails = async (publicId: string) => {
  const response = await api.get<CollectionDetails>(`/collection/${publicId}`);
  return response.data;
};
