import type {
  PartialUpdateProduct,
  Product,
  ProductDetails,
  ProductFormValues,
  StockDashboardDto,
} from "src/types/product";
import api from "./api";
import { uploadImage } from "./storage.service";

export const createProduct = async (
  createProductParams: ProductFormValues
): Promise<void> => {
  const variationsWithImages = await Promise.all(
    createProductParams.variations.map(async (variation) => {
      const images = variation.imageFiles.map(async (image) => {
        return await uploadImage(image);
      });

      return {
        ...variation,
        images: await Promise.all(images),
      };
    })
  );

  await api.post("/product", {
    ...createProductParams,
    variations: variationsWithImages,
  });
};

export const fetchProducts = async () => {
  const response = await api.get<Product[]>("/product");
  return response.data;
};

export const fetchStockDashboard = async () => {
  const response = await api.get<StockDashboardDto>("product/dashboard/stock");
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
  await api.patch(`/product/${publicId}/status`, { isActive });
};

export async function updateProduct(
  publicId: string,
  data: PartialUpdateProduct
) {
  const response = await api.patch(`/product/${publicId}`, data);
  return response.data;
}

export const deleteProduct = async (publicId: string) => {
  const response = await api.delete(`/product/${publicId}`);
  return response.data;
};
