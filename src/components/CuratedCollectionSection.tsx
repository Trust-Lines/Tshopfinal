"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, ShoppingCart, Sparkles, Layers, ShieldCheck } from "lucide-react";

interface CollectionItem {
  id: string;
  name: string;
  price: number;
  specs: string;
  x: number;
  y: number;
}

interface CuratedCollectionProps {
  onAddToCart: (product: any) => void;
  onAddBundleToCart?: (items: any[]) => void;
}

const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: "col-wall-display",
    name: "Illuminated Double-Bay Wall Shelving",
    price: 2450,
    specs: "Dual bay weathered wood display with LED backlit panels",
    x: 21,
    y: 22,
  },
  {
    id: "col-tall-rack",
    name: "Industrial Metal Frame Display Rack",
    price: 890,
    specs: "Matte black steel frame with dual lower wood cabinets",
    x: 50,
    y: 16,
  },
  {
    id: "col-nesting-tables",
    name: "3-Tier Nesting Display Table Set",
    price: 680,
    specs: "Set of 3 tiered nesting tables with weathered tops",
    x: 35,
    y: 68,
  },
  {
    id: "col-display-bench",
    name: "Low-Tier Island Display Bench",
    price: 420,
    specs: "Low-profile 2-tier display island with lower storage shelf",
    x: 62,
    y: 64,
  },
  {
    id: "col-mobile-counter",
    name: "Mobile Service & Checkout Counter",
    price: 1250,
    specs: "Rolling weathered wood cashier counter with top guard rail",
    x: 82,
    y: 60,
  },
];

export default function CuratedCollectionSection({
  onAddToCart,
  onAddBundleToCart,
}: CuratedCollectionProps) {
  const [activeHotspot, setActiveHotspot] = useState<CollectionItem | null>(null);
  const [isAddedAll, setIsAddedAll] = useState(false);

  const totalIndividualPrice = COLLECTION_ITEMS.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountPrice = 4990;

  const handleAddAll = () => {
    if (onAddBundleToCart) {
      const bundle = COLLECTION_ITEMS.map((item) => ({
        id: item.id,
        title: item.name,
        price: item.price,
        image: "/curated_collection.jpg",
        quantity: 1,
      }));
      onAddBundleToCart(bundle);
    } else {
      COLLECTION_ITEMS.forEach((item) => {
        onAddToCart({
          id: item.id,
          title: item.name,
          price: item.price,
          image: "/curated_collection.jpg",
        });
      });
    }

    setIsAddedAll(true);
    setTimeout(() => setIsAddedAll(false), 2500);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D92323]">
            Curated Complete Setup
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight mt-1.5">
            Nordic Industrial Collection
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            A cohesive collection of matching weathered wood & steel fixtures. Interactive hotspot preview — click any piece to inspect or bundle the entire room.
          </p>
        </div>

        {/* Interactive Showroom Stage — Clean, borderless & shadowless */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Main Stage Image Container (Transparent / Pure White, no box or shadow) */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center">
            <Image
              src="/curated_collection.jpg"
              alt="Nordic Industrial Complete Store Collection"
              fill
              priority
              className="object-contain"
            />

            {/* Interactive Hotspot Pins */}
            {COLLECTION_ITEMS.map((item) => {
              const isActive = activeHotspot?.id === item.id;
              return (
                <div
                  key={item.id}
                  style={{ top: `${item.y}%`, left: `${item.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : item)}
                    className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white border-2 border-[#D92323] rounded-full text-[#D92323] flex items-center justify-center hover:bg-[#D92323] hover:text-white transition-all cursor-pointer group"
                    aria-label={`View ${item.name}`}
                  >
                    <span className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-35" />
                    <Plus className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-90" />
                  </button>

                  {/* Hotspot Popup Card */}
                  {isActive && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-60 sm:w-64 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-900 leading-snug">
                          {item.name}
                        </span>
                        <span className="text-xs font-extrabold text-[#D92323] shrink-0">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                        {item.specs}
                      </p>
                      <button
                        onClick={() => {
                          onAddToCart({
                            id: item.id,
                            title: item.name,
                            price: item.price,
                            image: "/curated_collection.jpg",
                          });
                          setActiveHotspot(null);
                        }}
                        className="w-full py-1.5 bg-gray-950 hover:bg-[#D92323] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add Single Item</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Centered Add All to Cart Button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleAddAll}
              className={`px-10 py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
                isAddedAll
                  ? "bg-emerald-600 text-white"
                  : "bg-[#8c94a0] hover:bg-gray-800 text-white"
              }`}
            >
              {isAddedAll ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added Collection to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add All to Cart</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
