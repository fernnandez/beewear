"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartItem {
  publicId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (publicId: string) => void;
  updateQuantity: (publicId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedItems = localStorage.getItem("beewear-cart-local");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("beewear-cart-local", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.publicId === newItem.publicId
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.publicId === newItem.publicId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
    // notifications.show({
    //   title: "Item Adicionado",
    //   message: `${newItem.name} foi adicionado ao carrinho.`,
    //   color: "blue",
    // });
  }, []);

  const removeItem = useCallback((publicId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.publicId !== publicId)
    );
    // notifications.show({
    //   title: "Item Removido",
    //   message: "O item foi removido do carrinho.",
    //   color: "red",
    // });
  }, []);

  const updateQuantity = useCallback(
    (publicId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(publicId);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.publicId === publicId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    // notifications.show({
    //   title: "Carrinho Limpo",
    //   message: "Todos os itens foram removidos do carrinho.",
    //   color: "orange",
    // });
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
