"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/cart/CartContext";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F6] font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950">Your Store Layout Cart</h1>
            <p className="text-sm text-gray-600 mt-1">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#D92323] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 sm:p-16 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-900">Your cart is empty.</p>
            <p className="text-sm text-gray-600 mt-1">Add fixtures or design your store in the 3D Configurator.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/configurator"
                className="px-5 py-2.5 bg-[#D92323] hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Design My Store
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-bold rounded-xl transition-colors"
              >
                Browse Fixtures
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items */}
            <ul className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-200/80">
                    <Image src={item.image} alt={item.title} fill sizes="112px" className="object-contain p-1.5" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-bold text-gray-950">{item.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">${item.price.toLocaleString()} each</p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="p-2 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-l-lg transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-bold text-gray-900 min-w-8 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.title}`}
                            className="p-2 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-r-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg font-extrabold text-gray-950 shrink-0 sm:text-right">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-extrabold text-gray-950">Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Fixture Total</span>
                  <span className="font-extrabold text-gray-950">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>Confirmed in quote</span>
                </div>
              </div>

              <Link
                href="/order"
                className="mt-6 w-full py-3.5 bg-[#D92323] hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Continue to Quote Request</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-gray-600">No payment required.</p>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
