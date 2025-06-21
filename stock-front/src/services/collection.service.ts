import type { Collection } from "src/types/collection";
import api from "./api";

interface CreateCollectionParams {
  name: string;
  description: string;
  active: boolean;
  //   imageUrl: string TODO: implementar upload de imagems
}

export const createCollection = async (
  createCollectionParams: CreateCollectionParams
): Promise<any> => {
  console.log(createCollectionParams);
  await api.post("/collection", createCollectionParams);
};

export async function fetchCollections() {
  const response = await api.get<Collection[]>("/collection");
  return response.data;
}
