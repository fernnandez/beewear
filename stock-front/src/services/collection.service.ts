import type {
  Collection,
  CollectionDetails,
  PartialUpdateCollection,
} from "src/types/collection";
import api from "./api";

interface CreateCollectionParams {
  name: string;
  description?: string;
  active: boolean;
  imageUrl: string | null;
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

export const updateCollectionStatus = async (
  publicId: string,
  isActive: boolean
) => {
  await api.patch(`/collection/${publicId}/status`, { isActive });
};

export async function updateCollection(
  publicId: string,
  data: PartialUpdateCollection
) {
  const response = await api.patch(`/collection/${publicId}`, data);
  return response.data;
}
