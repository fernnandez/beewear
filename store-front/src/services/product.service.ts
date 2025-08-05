import api from "./api";
import { Product } from "../types/product";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get<Product[]>("/public/product");
    return data;
  },

  async getProduct(publicId: string): Promise<Product> {
    const { data } = await api.get<Product>(`/public/product/${publicId}`);
    return data;
  },

  async getCollections(): Promise<any[]> {
    const { data } = await api.get("/public/collection");
    return data;
  },
};
