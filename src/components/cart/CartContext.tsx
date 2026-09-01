"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (p: { id: string; title: string; price: number; image: string }) => void;
  addBundle: (items: CartItem[], opts?: { open?: boolean }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);

const SEED: CartItem[] = [
  {
    id: "prod-1",
    title: "Modular Double-Sided Wooden Gondola Shelving",
    price: 890,
    image: "/gondola_shelving.jpg",
    quantity: 1,
  },
  {
    id: "prod-3",
    title: "Ergonomic Supermarket Checkout Counter & POS Desk",
    price: 1450,
    image: "/store_3d_preview.jpg",
    quantity: 1,
  },
];

const STORAGE_KEY = "tshop_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(SEED);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback<CartCtx["addItem"]>((p) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex)
        return prev.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...p, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addBundle = useCallback<CartCtx["addBundle"]>((bundle, opts) => {
    setItems((prev) => [...prev, ...bundle]);
    if (opts?.open !== false) setIsOpen(true);
  }, []);

  const updateQuantity = useCallback<CartCtx["updateQuantity"]>((id, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback<CartCtx["removeItem"]>((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((a, b) => a + b.quantity, 0);
    const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      addBundle,
      updateQuantity,
      removeItem,
    };
  }, [items, isOpen, addItem, addBundle, updateQuantity, removeItem]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}
