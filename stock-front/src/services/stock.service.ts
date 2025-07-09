import api from "./api";

export type StockMovementType = "IN" | "OUT";
export interface AdjustStockPayload {
  quantity: number;
  description?: string;
}

export async function adjustStock(
  stockItemPublicId: string,
  payload: AdjustStockPayload
) {
  const response = await api.post(
    `/stock/${stockItemPublicId}/adjust`,
    payload
  );

  return response.data;
}

export async function fetchStockMovements(stockItemPublicId: string) {
  const response = await api.get(`/stock/${stockItemPublicId}/movements`);
  return response.data;
}
