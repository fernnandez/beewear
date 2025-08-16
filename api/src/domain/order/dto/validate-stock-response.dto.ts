export class ValidateStockItemResponseDto {
  productVariationSizePublicId: string;
  productName: string;
  variationName: string;
  size: string;
  color: string;
  requestedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  price: number;
}

export class ValidateStockResponseDto {
  isValid: boolean;
  items: ValidateStockItemResponseDto[];
  totalAmount: number;
  message?: string;
}
