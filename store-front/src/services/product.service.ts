import {
  PaginatedResponse,
  PaginationParams,
  ProductFilters,
} from "../types/pagination";
import { Collection, Product } from "../types/product";
import api from "./api";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get<Product[]>("/public/product");
    return data;
  },

  async getProduct(publicId: string): Promise<Product> {
    const { data } = await api.get<Product>(`/public/product/${publicId}`);
    return data;
  },

  async getCollections(): Promise<Collection[]> {
    const { data } = await api.get("/public/collection");
    return data;
  },

  async getProductsPaginated(
    pagination: PaginationParams = {},
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();

    // Adicionar parâmetros de paginação
    if (pagination.page) params.append("page", pagination.page.toString());
    if (pagination.limit) params.append("limit", pagination.limit.toString());

    // Adicionar filtros
    if (filters.search) params.append("search", filters.search);
    if (filters.active !== undefined)
      params.append("active", filters.active.toString());
    if (filters.collectionId)
      params.append("collectionId", filters.collectionId);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters.colors?.length)
      params.append("colors", filters.colors.join(","));
    if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","));
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const { data } = await api.get<PaginatedResponse<Product>>(
      `/public/product/paginated?${params.toString()}`
    );
    return data;
  },
};
