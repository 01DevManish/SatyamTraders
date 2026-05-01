"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === newItem.id && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true); // auto-open cart drawer after adding
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const updateQty = useCallback((id: string, size: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.size === size
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
