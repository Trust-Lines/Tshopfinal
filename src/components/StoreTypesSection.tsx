"use client";

import React from "react";
import Link from "next/link";

const STORE_TYPES = [
  {
    id: "convenience-stores",
    title: "Convenience Stores",
    image: "/store_type_convenience.jpg",
    alt: "Modern convenience store retail fixture layout with snack racks and refrigerated coolers",
  },
  {
    id: "jewellery-stores",
    title: "Jewellery Stores",
    image: "/store_type_jewellery.jpg",
    alt: "Luxury jewellery boutique retail fixture showcase displays and counters",
  },
  {
    id: "truck-stop",
    title: "Truck Stop",
    image: "/store_type_truck_stop.jpg",
    alt: "Highway truck stop and travel center retail fixtures and snack aisles",
  },
  {
    id: "grocery-stores",
    title: "Grocery Stores",
    image: "/store_type_grocery.jpg",
    alt: "Modern supermarket and grocery store fixture shelving aisles and produce tables",
  },
];

export default function StoreTypesSection() {
  return (
    <section className="relative w-full bg-[#f7f8f8] py-16 sm:py-20 lg:py-24 border-t border-gray-100 overflow-hidden">
      {/* Soft decorative background curved line art */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Left arc */}
        <ellipse
          cx="30"
          cy="340"
          rx="240"
          ry="300"
          stroke="#fca5a5"
          strokeWidth="2.5"
          strokeOpacity="0.45"
        />
        {/* Left secondary upper arc */}
        <ellipse
          cx="-60"
          cy="180"
          rx="180"
          ry="220"
          stroke="#fca5a5"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        {/* Right lower arc */}
        <ellipse
          cx="1400"
          cy="580"
          rx="260"
          ry="320"
          stroke="#fca5a5"
          strokeWidth="2.5"
          strokeOpacity="0.4"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content: Badge & Title */}
        <div className="mb-10 sm:mb-12">
          {/* Spacing preserved from removed Store Type badge */}
          <div className="h-[46px]" aria-hidden="true" />

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.02em] text-[#141414] leading-[1.08]">
            For all<br />
            retail store types
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {STORE_TYPES.map((type) => (
            <Link
              key={type.id}
              href="/configurator"
              className="group relative flex flex-col justify-between bg-white border border-gray-200 rounded-[28px] p-5 sm:p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 cursor-pointer"
            >
              {/* Product / Layout Image */}
              <div className="w-full flex-1 flex items-center justify-center min-h-[220px] sm:min-h-[250px] p-2">
                <img
                  src={type.image}
                  alt={type.alt}
                  className="w-full h-44 sm:h-52 object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              {/* Title */}
              <div className="pt-3 pb-2 text-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-wider uppercase">
                  {type.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
