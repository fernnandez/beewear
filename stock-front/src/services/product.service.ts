import type { ProductFormValues } from "src/types/product";
import api from "./api";

export const createProduct = async (
  createProductParams: ProductFormValues
): Promise<void> => {
  console.log(createProductParams);
  await api.post("/product", createProductParams);
};
