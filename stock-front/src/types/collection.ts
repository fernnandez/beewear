import type { Product } from "./product";

export interface Collection {
  id: number;
  publicId: string;
  name: string;
  active: boolean;
  description: string;
  imageUrl: string | null;
  createdAt: string; // ou Date, dependendo do seu uso
  updatedAt: string; // ou Date
  deletedAt: string | null; // ou Date | null
}

export interface CollectionDetails {
  publicId: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  active: boolean;
  createdAt: string; // se preferir Date, pode mudar, mas tenha consistência
  updatedAt: string;
  aggregations: {
    totalProducts: number;
    totalStock: number;
    totalValue: number;
  };
  products: Product[];
}
