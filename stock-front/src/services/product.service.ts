import api from "./api";

interface createProductParams {
  name: string;
  collectionId: string;
  variations: {
    color: string;
    size: string;
    price: number;
    initialStock: number;
  }[];
}

export const createProduct = async (
  createProductParams: createProductParams
): Promise<any> => {
  console.log(createProductParams);
  await api.post("/product", createProductParams);
};
