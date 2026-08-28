"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalQuantity = items.reduce((a, b) => a + b.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D92323]" />
              <h2 className="text-lg font-bold text-gray-950">
                Your Store Layout Cart ({totalQuantity})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100 bg-white">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">
                  Your store layout cart is empty.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Add fixtures or use the 3D Configurator to build your store.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center bg-white">
                  <div className="w-16 h-16 relative rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-200/80 p-1 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-[#D92323] mt-0.5">
                      ${item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg text-xs bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-l-lg transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-r-lg transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FAFAFA] space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-extrabold text-gray-950 text-base">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>3D Layout Consultation</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Freight Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <button
                onClick={() => alert("Proceeding to secure checkout...")}
                className="w-full py-3.5 bg-[#D92323] hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Order & Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>10-Year Heavy Duty Commercial Warranty</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
