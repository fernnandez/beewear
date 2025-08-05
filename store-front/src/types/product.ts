export interface Collection {
  id: number;
  publicId: string;
  name: string;
  active: boolean;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface StockItem {
  id: number;
  publicId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ProductVariationSize {
  size: string;
  stock: StockItem;
}

export interface ProductVariation {
  publicId: string;
  color: string;
  name: string;
  price: number;
  images: string[];
  sizes: ProductVariationSize[];
  stock: number;
}

export interface ProductAggregations {
  totalStock: number;
  totalValue: number;
}

export interface Product {
  id: number;
  publicId: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  aggregations: ProductAggregations;
  collection: Collection;
  variations: ProductVariation[];
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 