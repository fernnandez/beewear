export interface CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string;
  }>;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface PaymentOrderData {
  userId: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    productVariationSizePublicId: string;
  }>;
  shippingAddress: string;
  totalAmount: number;
  stripeSessionId: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: string;
  paymentStatus: string;
  sessionId?: string;
  paymentIntentId?: string;
  amountTotal?: number;
  customerEmail?: string;
  metadata?: any;
  createdAt?: number;
  expiresAt?: number;
  paymentDetails?: {
    id: string;
    method: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    card?: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  customerInfo?: {
    id: string;
    email: string;
    name?: string;
    phone?: string | null;
  };
  billingAddress?: any;
  shippingAddress?: any;
  error?: string;
}

export interface PaymentProvider {
  createCheckoutSession(data: CreateCheckoutSessionDto): Promise<{
    id: string;
    url: string;
  }>;

  verifyPaymentStatus(
    paymentIntentId: string,
  ): Promise<PaymentVerificationResult>;
}
