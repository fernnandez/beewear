import { Collection } from "./collection";

export interface ProductFormValues {
  name: string;
  active: boolean;
  collectionPublicId: string;
  variations: ProductVariationFormValues[];
}

export interface ProductVariationFormValues {
  color: string;
  name: string;
  imageFiles: File[];
  price: number;
}

export interface ProductVariationSize {
  publicId: string;
  size: Size;
  stock: any;
}

export enum Size {
  XXS = "XXS",
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export interface ProductVariation {
  publicId: string;
  images?: string[];
  name: string;
  color: string;
  sizes: ProductVariationSize[];
  price: number;
}

export interface Product {
  publicId: string;
  name: string;
  active: boolean;
  variations: ProductVariation[];
  collection: Collection;
}

export interface ProductDetails {
  publicId: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  aggregations: {
    totalStock: number;
    totalValue: number;
  };
  variations: ProductVariation[];
  collection: Collection;
}

export interface PartialUpdateProduct {
  name?: string;
}
