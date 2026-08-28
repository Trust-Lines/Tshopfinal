"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Building2,
  SlidersHorizontal,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

interface FixtureCatalogProps {
  onAddToCart: (product: any) => void;
  onOpenConfigurator?: () => void;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  area: string;
  industry: string;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: "gondola-shelving",
    title: "Gondola Shelving Unit",
    price: 849.0,
    area: "Aisles & Gondolas",
    industry: "Grocery",
    image: "/gondola_shelving_unit.jpg",
  },
  {
    id: "wall-display",
    title: "Wall Display Unit",
    price: 699.0,
    area: "Aisles & Gondolas",
    industry: "Convenience",
    image: "/wall_display_unit.jpg",
  },
  {
    id: "cashier-counter",
    title: "Cashier Counter",
    price: 1299.0,
    area: "Cashier",
    industry: "Convenience",
    image: "/cashier_counter.jpg",
  },
  {
    id: "coffee-island",
    title: "Coffee Island",
    price: 2199.0,
    area: "Coffee & Food",
    industry: "Travel Stop",
    image: "/coffee_island.jpg",
  },
  {
    id: "end-cap-display",
    title: "End Cap Display",
    price: 529.0,
    area: "Aisles & Gondolas",
    industry: "Grocery",
    image: "/end_cap_display.jpg",
  },
  {
    id: "beverage-cooler",
    title: "Beverage Cooler",
    price: 1899.0,
    area: "Aisles & Gondolas",
    industry: "Convenience",
    image: "/beverage_cooler.jpg",
  },
];

const AREA_FILTERS = [
  { id: "all", label: "All Products" },
  { id: "Aisles & Gondolas", label: "Aisles & Gondolas" },
  { id: "Cashier", label: "Cashier" },
  { id: "Coffee & Food", label: "Coffee & Food" },
];

const INDUSTRY_FILTERS = [
  { id: "all", label: "All Industries" },
  { id: "Convenience", label: "Convenience" },
  { id: "Grocery", label: "Grocery" },
  { id: "Travel Stop", label: "Travel Stop" },
];

export default function FixtureCatalog({
  onAddToCart,
  onOpenConfigurator,
}: FixtureCatalogProps) {
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchArea = selectedArea === "all" || p.area === selectedArea;
    const matchIndustry =
      selectedIndustry === "all" || p.industry === selectedIndustry;
    return matchArea && matchIndustry;
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
              Browse by area or store type.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={() => {
                setSelectedArea("all");
                setSelectedIndustry("all");
              }}
              className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors flex items-center gap-1.5 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                setSelectedArea("all");
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
          {/* Row 1: Area */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 w-28 shrink-0 text-gray-800 font-semibold text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Area</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
              {AREA_FILTERS.map((filter) => {
                const isActive = selectedArea === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedArea(filter.id)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ${
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
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ${
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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200/90 rounded-2xl p-5 flex flex-col justify-between bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              {/* Product Image Area */}
              <div className="relative w-full h-56 sm:h-60 mb-4 bg-white flex items-center justify-center overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
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
                    ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">
                    {product.area}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  aria-label={`Add ${product.title} to cart`}
                  className="w-10 h-10 rounded-full border border-[#D92323] text-[#D92323] flex items-center justify-center hover:bg-[#D92323] hover:text-white transition-all duration-150 shadow-xs shrink-0 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if filters yield no items */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">No fixtures found matching selected filters.</p>
            <button
              onClick={() => {
                setSelectedArea("all");
                setSelectedIndustry("all");
              }}
              className="mt-3 text-sm font-semibold text-red-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
