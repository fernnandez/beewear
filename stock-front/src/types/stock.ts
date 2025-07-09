export type StockMovement = {
  id: number;
  publicId: string;
  type: "IN" | "OUT";
  quantity: number;
  newQuantity: number;
  previousQuantity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
