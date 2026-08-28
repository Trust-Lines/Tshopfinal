"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConfiguratorSteps from "@/components/ConfiguratorSteps";
import FixtureCatalog from "@/components/FixtureCatalog";
import StoreConfigurator from "@/components/StoreConfigurator";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function Home() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initial cart state matching the badge '2' in the user prompt screenshot
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
  ]);

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (bundleItems: CartItem[]) => {
    setCartItems((prev) => [...prev, ...bundleItems]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onBuildClick={() => setIsConfiguratorOpen(true)}
          onAddToCart={handleAddToCart}
        />

        {/* 4-Step Process Bar with Custom SVG Icons */}
        <ConfiguratorSteps
          onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        />

        {/* Fixture Catalog */}
        <FixtureCatalog
          onAddToCart={handleAddToCart}
          onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <StoreConfigurator
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        onAddToCart={handleAddBundleToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
