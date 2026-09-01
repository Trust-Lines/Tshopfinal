"use client";

import React from "react";
import { Inter_Tight } from "next/font/google";
import { ArrowRight } from "lucide-react";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface HeroSectionProps {
  onBuildClick: () => void;
  onAddToCart: (item: any) => void;
}

export default function HeroSection({ onBuildClick }: HeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Hero Split Panel: Video on Left, Text on Right */}
        <div className="overflow-hidden flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-8">

          {/* LEFT — Video Panel */}
          <div className="relative w-full lg:w-1/2 min-h-[260px] sm:min-h-[340px] lg:min-h-[480px] bg-gray-100 overflow-hidden rounded-2xl">
            <video
              src="/store_preview.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* 20 ft dimension indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-4/5 max-w-xs">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-full px-4 py-1.5 shadow-md flex items-center justify-center gap-2">
                <span className="h-0.5 flex-1 bg-gray-400 relative">
                  <span className="absolute left-0 -top-1 w-0.5 h-2.5 bg-gray-600" />
                  <span className="absolute right-0 -top-1 w-0.5 h-2.5 bg-gray-600" />
                </span>
                <span className="text-xs font-bold text-gray-800 tracking-wider">20 ft</span>
                <span className="h-0.5 flex-1 bg-gray-400 relative">
                  <span className="absolute left-0 -top-1 w-0.5 h-2.5 bg-gray-600" />
                  <span className="absolute right-0 -top-1 w-0.5 h-2.5 bg-gray-600" />
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Text Content */}
          <div className="w-full lg:w-1/2 p-2 sm:p-6 lg:p-10 flex flex-col justify-center bg-white">
            <h1
              className={`
                ${interTight.className}
                text-[36px]
                sm:text-[48px]
                md:text-[54px]
                lg:text-[64px]
                xl:text-[72px]
                font-light
                tracking-[-0.045em]
                leading-[0.92]
                text-gray-950
                mb-5
              `}
            >
              <span className="block sm:whitespace-nowrap">YOUR STORE</span>
              <span className="block sm:whitespace-nowrap mt-1">YOUR SPACE</span>
              <span className="relative inline-block sm:whitespace-nowrap mt-1">
                <span className="glitter-text">OUR DESIGN.</span>
              </span>
            </h1>

            <div className="mb-8 space-y-1">
              <p className="text-base sm:text-lg font-bold text-red-600">
                All in one place
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Retail fixtures built to fit your store.
              </p>
            </div>

            <div>
              <button
                onClick={onBuildClick}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-full shadow-lg shadow-red-600/25 transition-all duration-150 group cursor-pointer"
              >
                <span>Build Your Store</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
