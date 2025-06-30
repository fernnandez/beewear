import type {
  PartialUpdateProduct,
  Product,
  ProductDetails,
  ProductFormValues,
} from "src/types/product";
import api from "./api";

export const createProduct = async (
  createProductParams: ProductFormValues
): Promise<void> => {
  console.log(createProductParams);
  await api.post("/product", createProductParams);
};

export const fetchProducts = async () => {
  const response = await api.get<Product[]>("/product");
  return response.data;
};

export const fetchProductDetails = async (publicId: string) => {
  const response = await api.get<ProductDetails>(`/product/${publicId}`);
  return response.data;
};

export const updateProductStatus = async (
  publicId: string,
  isActive: boolean
) => {
  console.log("alou");
  await api.patch(`/product/${publicId}/status`, { isActive });
};


export async function updateProduct(
  publicId: string,
  data: PartialUpdateProduct
) {
  const response = await api.patch(`/product/${publicId}`, data);
  return response.data;
}

