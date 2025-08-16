import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import React, { createContext, useContext, useState } from "react";
import orderService, {
  CreateOrder,
  OrderResponse,
} from "../services/order.service";
import { Address } from "../types/address";
import { useAuth } from "./auth-context";
import { useCart } from "./cart-context";

interface CheckoutContextType {
  selectedAddressId: number | null;
  selectedAddress: Address | null;
  setSelectedAddressId: (id: number | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  isCheckoutComplete: boolean;
  isCreatingOrder: boolean;
  createOrder: () => Promise<OrderResponse | null>;
  orderError: string | null;
  clearOrderError: () => void;
  formatAddressToString: () => string;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { getOrderItems } = useCart();
  const { user } = useAuth();

  const isCheckoutComplete = selectedAddressId !== null;
  const clearOrderError = () => setOrderError(null);

  const formatAddressToString = (): string => {
    if (!selectedAddress) return "Endereço não selecionado";

    const parts = [
      selectedAddress.street,
      selectedAddress.number,
      selectedAddress.complement && `- ${selectedAddress.complement}`,
      selectedAddress.neighborhood,
      selectedAddress.city,
      selectedAddress.state,
      selectedAddress.postalCode,
      selectedAddress.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

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

      const orderItems = getOrderItems();
      const addressString = formatAddressToString();

      const orderData: CreateOrder = {
        items: orderItems,
        shippingAddressId: selectedAddressId,
        shippingAddressString: addressString,
        paymentMethodType: "CREDIT_CARD", // Método padrão simplificado
        paymentMethodName: "Cartão de Crédito", // Nome padrão
      };

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

  const value: CheckoutContextType = {
    selectedAddressId,
    selectedAddress,
    setSelectedAddressId,
    setSelectedAddress,
    isCheckoutComplete,
    isCreatingOrder,
    createOrder,
    orderError,
    clearOrderError,
    formatAddressToString,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);

  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }

  return context;
}
