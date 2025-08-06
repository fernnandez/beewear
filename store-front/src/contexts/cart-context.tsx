import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Funções utilitárias para cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

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

  // Load cart from cookie on initial mount
  useEffect(() => {
    const storedItems = getCookie("beewear-cart");
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error("Erro ao carregar carrinho do cookie:", error);
        deleteCookie("beewear-cart");
      }
    }
  }, []);

  // Persist cart to cookie whenever items change
  useEffect(() => {
    if (items.length > 0) {
      setCookie("beewear-cart", JSON.stringify(items), 30); // 30 dias
    } else {
      deleteCookie("beewear-cart");
    }
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
  }, []);

  const removeItem = useCallback((publicId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.publicId !== publicId)
    );
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
    deleteCookie("beewear-cart");
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
