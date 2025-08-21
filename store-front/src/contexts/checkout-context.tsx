import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import React, { createContext, useContext, useState } from "react";
import orderService, {
  CreateOrder,
  OrderResponse,
} from "../services/order.service";
import { Address } from "../types/address";
import { useCart } from "./cart-context";
import { useAuth } from "./auth-context";

interface CheckoutContextType {
  selectedAddressId: number | null;
  selectedAddress: Address | null;
  setSelectedAddressId: (id: number | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  isCheckoutComplete: boolean;
  isCreatingOrder: boolean;
  isConfirmingOrder: boolean;
  currentOrder: OrderResponse | null;
  createOrder: () => Promise<OrderResponse | null>;
  confirmOrder: (sessionId: string) => Promise<OrderResponse | null>;
  clearOrder: () => void;
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
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { getOrderItems, clearCart } = useCart();
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
        shippingAddressString: addressString,
      };

      const order = await orderService.createOrder(orderData);
      setCurrentOrder(order);
      return order;
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error, "Erro ao criar pedido");
      setOrderError(errorMessage);
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const confirmOrder = async (
    sessionId: string
  ): Promise<OrderResponse | null> => {
    if (!currentOrder) {
      setOrderError("Nenhum pedido para confirmar");
      return null;
    }

    try {
      setIsConfirmingOrder(true);
      setOrderError(null);

      const confirmedOrder = await orderService.confirmOrder(
        currentOrder.publicId,
        sessionId
      );

      console.log(confirmedOrder);

      // Se o pedido foi confirmado com sucesso, limpar o carrinho
      if (confirmedOrder.status === "CONFIRMED") {
        clearCart();
      }

      setCurrentOrder(confirmedOrder);
      return confirmedOrder;
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(
        error,
        "Erro ao confirmar pedido"
      );
      setOrderError(errorMessage);
      return null;
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  const clearOrder = () => {
    setCurrentOrder(null);
    setOrderError(null);
  };

  const value: CheckoutContextType = {
    selectedAddressId,
    selectedAddress,
    setSelectedAddressId,
    setSelectedAddress,
    isCheckoutComplete,
    isCreatingOrder,
    isConfirmingOrder,
    currentOrder,
    createOrder,
    confirmOrder,
    clearOrder,
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
