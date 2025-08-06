import React, { createContext, useContext, useState } from "react";

interface CheckoutContextType {
  selectedAddressId: number | null;
  selectedPaymentId: string;
  setSelectedAddressId: (id: number | null) => void;
  setSelectedPaymentId: (id: string) => void;
  isCheckoutComplete: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");

  const isCheckoutComplete =
    selectedAddressId !== null && selectedPaymentId !== "";

  const value = {
    selectedAddressId,
    selectedPaymentId,
    setSelectedAddressId,
    setSelectedPaymentId,
    isCheckoutComplete,
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
