import type {
  Collection,
  CollectionDetails,
  PartialUpdateCollection,
} from "src/types/collection";
import api from "./api";
import { uploadImage } from "./storage.service";

interface CreateCollectionParams {
  name: string;
  description?: string;
  active: boolean;
  imageFile: File | null;
}

export const createCollection = async (
  createCollectionParams: CreateCollectionParams
): Promise<void> => {
  const imageUrl = createCollectionParams.imageFile
    ? await uploadImage(createCollectionParams.imageFile)
    : null;

  console.log(createCollectionParams);

  await api.post("/collection", { ...createCollectionParams, imageUrl });
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

export async function updateCollectionImage(
  collectionPublicId: string,
  image: File
) {
  const imageUrl = await uploadImage(image);

  const { data } = await api.patch(`/collection/${collectionPublicId}/image`, {
    image: imageUrl,
  });
  return data;
}
