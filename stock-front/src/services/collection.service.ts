import api from "./api";

interface CreateCollectionParams {
  name: string;
  description: string;
  //   imageUrl: string TODO: implementar upload de imagems
}

export const createCollection = async (
  createCollectionParams: CreateCollectionParams
): Promise<any> => {
  console.log(createCollectionParams);
  await api.post("/collection", createCollectionParams);
};
