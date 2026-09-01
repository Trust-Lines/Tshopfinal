"use client";

import React from "react";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "./CartContext";

export default function GlobalCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  return (
    <CartDrawer
      isOpen={isOpen}
      onClose={closeCart}
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
    />
  );
}
