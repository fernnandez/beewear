export type ProductFormValues = {
  name: string;
  collectionId: string;
  variations: {
    color: string;
    size: string;
    price: number;
    initialStock: number;
    sku: string;
  }[];
};