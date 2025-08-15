import React, { createContext, useContext, useState } from "react";
import orderService, {
  CreateOrder,
  OrderResponse,
} from "../services/order.service";
import { useCart } from "./cart-context";
import { useAuth } from "./auth-context";
import { Address } from "../types/address";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";

interface CheckoutContextType {
  selectedAddressId: number | null;
  selectedAddress: Address | null;
  selectedPaymentId: string;
  setSelectedAddressId: (id: number | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  setSelectedPaymentId: (id: string) => void;
  isCheckoutComplete: boolean;
  isCreatingOrder: boolean;
  createOrder: () => Promise<OrderResponse | null>;
  orderError: string | null;
  clearOrderError: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { getOrderItems } = useCart();
  const { user } = useAuth();

  const isCheckoutComplete =
    selectedAddressId !== null && selectedPaymentId !== "";

  const clearOrderError = () => setOrderError(null);

  const createOrder = async (): Promise<OrderResponse | null> => {
    if (!isCheckoutComplete || !selectedAddressId || !selectedAddress) {
      setOrderError("Dados de checkout incompletos");
      return null;
    }

    if (!user) {
      setOrderError("Usuário não autenticado");
      return null;
    }

    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      // Obter apenas os campos necessários para o pedido
      const orderItems = getOrderItems();

      // Log para debug - remover depois
      console.log("Itens do pedido (limpos):", orderItems);

      // Mapear método de pagamento
      const paymentMethodMap: Record<
        string,
        "CREDIT_CARD" | "PIX" | "BANK_TRANSFER"
      > = {
        credit_card: "CREDIT_CARD",
        pix: "PIX",
        bank_transfer: "BANK_TRANSFER",
      };

      // Formatar endereço como string
      const addressString = `${selectedAddress.street}, ${
        selectedAddress.number
      }${
        selectedAddress.complement ? ` - ${selectedAddress.complement}` : ""
      }, ${selectedAddress.neighborhood}, ${selectedAddress.city} - ${
        selectedAddress.state
      }, ${selectedAddress.postalCode}, ${selectedAddress.country}`;

      const orderData: CreateOrder = {
        items: orderItems,
        shippingAddressId: selectedAddressId,
        shippingAddressString: addressString,
        paymentMethodType: paymentMethodMap[selectedPaymentId] || "PIX",
        paymentMethodName:
          selectedPaymentId === "credit_card"
            ? "Cartão de Crédito"
            : selectedPaymentId === "pix"
            ? "PIX"
            : "Transferência Bancária",
      };

      // Log para debug - remover depois
      console.log(
        "Dados finais enviados para API:",
        JSON.stringify(orderData, null, 2)
      );

      const order = await orderService.createOrder(orderData);

      return order;
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error, "Erro ao criar pedido");
      setOrderError(errorMessage);
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const value = {
    selectedAddressId,
    selectedAddress,
    selectedPaymentId,
    setSelectedAddressId,
    setSelectedAddress,
    setSelectedPaymentId,
    isCheckoutComplete,
    isCreatingOrder,
    createOrder,
    orderError,
    clearOrderError,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
