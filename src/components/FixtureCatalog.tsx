"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Building2,
  SlidersHorizontal,
  ArrowRight,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { useCart } from "./cart/CartContext";

export interface Product {
  id: string;
  title: string;
  price: number;
  zone: string;
  displayCategory: string;
  industry: string;
  image: string;
  isSpecialZoneCard?: boolean;
  zoneDescription?: string;
  piecesCount?: number;
}

const PRODUCTS: Product[] = [
  {
    id: "convenience-zone-card",
    title: "The Convenience Zone",
    price: 0,
    zone: "Convenience",
    displayCategory: "Convenience",
    industry: "Convenience",
    image: "/convenience_zone.jpg",
    isSpecialZoneCard: true,
    zoneDescription:
      "Smart fixtures for everyday essentials\nand quick purchases.",
    piecesCount: 30,
  },
  {
    id: "wall-display",
    title: "Wall Display Unit",
    price: 699.0,
    zone: "Gondola",
    displayCategory: "Aisles & Gondolas",
    industry: "Convenience",
    image: "/wall_display_unit.jpg",
  },
  {
    id: "cashier-counter",
    title: "Cashier Counter",
    price: 1299.0,
    zone: "Checkout",
    displayCategory: "Cashier",
    industry: "Convenience",
    image: "/cashier_counter.jpg",
  },
  {
    id: "coffee-island",
    title: "Coffee Island",
    price: 2199.0,
    zone: "Food & Beverage",
    displayCategory: "Coffee & Food",
    industry: "Travel Stop",
    image: "/coffee_island.jpg",
  },
  {
    id: "end-cap-display",
    title: "End Cap Display",
    price: 529.0,
    zone: "Gondola",
    displayCategory: "Aisles & Gondolas",
    industry: "Grocery",
    image: "/end_cap_display.jpg",
  },
  {
    id: "beverage-cooler",
    title: "Beverage Cooler",
    price: 1899.0,
    zone: "Food & Beverage",
    displayCategory: "Aisles & Gondolas",
    industry: "Convenience",
    image: "/beverage_cooler.jpg",
  },
];

const ZONE_FILTERS = [
  { id: "all", label: "All Zones" },
  { id: "Convenience", label: "Convenience" },
  { id: "Gondola", label: "Gondola" },
  { id: "Checkout", label: "Checkout" },
  { id: "Food & Beverage", label: "Food & Beverage" },
];

const INDUSTRY_FILTERS = [
  { id: "all", label: "All Industries" },
  { id: "Convenience", label: "Convenience" },
  { id: "Grocery", label: "Grocery" },
  { id: "Travel Stop", label: "Travel Stop" },
];

export default function FixtureCatalog() {
  const { addItem } = useCart();
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchZone =
      selectedZone === "all" ||
      p.zone === selectedZone ||
      (selectedZone === "Convenience" && p.industry === "Convenience");
    const matchIndustry =
      selectedIndustry === "all" || p.industry === selectedIndustry;
    return matchZone && matchIndustry;
  });

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Shop the fixtures you need
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Browse by zone or store type.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={() => {
                setSelectedZone("all");
                setSelectedIndustry("all");
              }}
              className="text-xs sm:text-sm font-semibold text-[#D92323] hover:text-red-700 transition-colors flex items-center gap-1.5 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 text-[#D92323] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                setSelectedZone("all");
                setSelectedIndustry("all");
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-200 hover:border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Card Container */}
        <div className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 mb-10 bg-white shadow-2xs space-y-4">
          {/* Row 1: Zones */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 w-28 shrink-0 text-gray-800 font-semibold text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Zones</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
              {ZONE_FILTERS.map((filter) => {
                const isActive = selectedZone === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedZone(filter.id)}
                    className={`px-3.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#D92323] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50/80"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Industry */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 w-28 shrink-0 text-gray-800 font-semibold text-xs sm:text-sm">
              <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Industry</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
              {INDUSTRY_FILTERS.map((filter) => {
                const isActive = selectedIndustry === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedIndustry(filter.id)}
                    className={`px-3.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#D92323] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50/80"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid: 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => {
            if (product.isSpecialZoneCard) {
              return (
                <Link
                  key={product.id}
                  href="/configurator"
                  className="border border-gray-200/90 rounded-2xl p-6 flex flex-col justify-between bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  {/* Special Zone Image Area */}
                  <div className="relative w-full h-52 sm:h-60 mb-5 bg-white flex items-center justify-center overflow-hidden rounded-xl">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-1 group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>

                  {/* Info & Bottom Zone Action */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed whitespace-pre-line max-w-[280px]">
                        {product.zoneDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-2">
                      <span className="bg-[#1c222b] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs">
                        {product.piecesCount} pieces
                      </span>
                      <span className="text-sm font-bold text-[#D92323] group-hover:text-red-700 flex items-center gap-1 transition-colors">
                        <span>View Zone</span>
                        <ChevronRight className="w-4 h-4 text-[#D92323] group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={product.id}
                className="border border-gray-200/90 rounded-2xl p-5 flex flex-col justify-between bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                {/* Product Image Area */}
                <div className="relative w-full h-52 sm:h-56 mb-4 bg-white flex items-center justify-center overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain p-2 group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                {/* Product Info & Cart Button */}
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight leading-snug">
                      {product.title}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-[#D92323] mt-1">
                      $
                      {product.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-400 font-normal mt-0.5">
                      {product.displayCategory}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    aria-label={`Add ${product.title} to cart`}
                    className="w-10 h-10 rounded-full border border-[#D92323] text-[#D92323] flex items-center justify-center hover:bg-[#D92323] hover:text-white transition-all duration-150 shadow-xs shrink-0 cursor-pointer active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if filters yield no items */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">
              No fixtures found matching selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedZone("all");
                setSelectedIndustry("all");
              }}
              className="mt-3 text-sm font-semibold text-[#D92323] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
