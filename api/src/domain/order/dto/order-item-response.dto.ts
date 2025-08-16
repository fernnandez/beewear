export class OrderItemResponseDto {
  id: number;
  productName: string;
  variationName: string;
  color: string;
  size: string;
  image?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariationSizePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}
