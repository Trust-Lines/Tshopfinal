"use client";

import React, { useState } from "react";
import { Inter_Tight } from "next/font/google";
import {
  ArrowRight,
  Plus,
  Maximize2,
} from "lucide-react";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface HeroSectionProps {
  onBuildClick: () => void;
  onAddToCart: (item: any) => void;
}

interface Hotspot {
  id: string;
  name: string;
  price: string;
  specs: string;
  x: number;
  y: number;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "counter",
    name: "Modular Wooden POS Counter",
    price: "$1,450",
    specs: "Integrated cable mgmt & dual POS mount",
    x: 32,
    y: 65,
  },
  {
    id: "gondola",
    name: "Heavy-Duty Gondola Island",
    price: "$890 / unit",
    specs: "Double-sided solid wood & steel shelves",
    x: 54,
    y: 48,
  },
  {
    id: "cooler",
    name: "Commercial Glass Cooler Wall",
    price: "$3,200",
    specs: "Triple Low-E glass doors & LED lights",
    x: 87,
    y: 42,
  },
];

export default function HeroSection({ onBuildClick, onAddToCart }: HeroSectionProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Hero Split Panel: Video on Left, Text on Right */}
        <div className="overflow-hidden flex flex-col-reverse lg:flex-row min-h-[480px]">

          {/* LEFT — Video Panel */}
          <div className="relative w-full lg:w-7/12 min-h-[360px] lg:min-h-0 bg-gray-100 overflow-hidden">
            <video
              src="/store_preview.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Expand button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onBuildClick}
                title="Expand builder"
                className="w-9 h-9 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-colors shadow-md"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hotspot pins */}
            {HOTSPOTS.map((hs) => (
              <div
                key={hs.id}
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() =>
                    setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)
                  }
                  className="relative w-8 h-8 bg-white border-2 border-red-600 rounded-full text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-md"
                  aria-label={`View ${hs.name}`}
                >
                  <span className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-40" />
                  <Plus className="w-4 h-4 relative z-10" />
                </button>

                {activeHotspot?.id === hs.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl p-3.5 z-30">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900 leading-snug">
                        {hs.name}
                      </span>
                      <span className="text-xs font-extrabold text-red-600 shrink-0">
                        {hs.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-2.5">{hs.specs}</p>
                    <button
                      onClick={() => {
                        onAddToCart({
                          id: hs.id,
                          title: hs.name,
                          price: parseFloat(hs.price.replace(/[^0-9.]/g, "")),
                          image: "/gondola_shelving.jpg",
                        });
                        setActiveHotspot(null);
                      }}
                      className="w-full py-1.5 bg-gray-950 hover:bg-red-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Add to Layout
                    </button>
                  </div>
                )}
              </div>
            ))}

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
          <div className="w-full lg:w-5/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
            <h1
              className={`
                ${interTight.className}
                text-[52px]
                sm:text-[64px]
                xl:text-[78px]
                font-light
                tracking-[-0.045em]
                leading-[0.98]
                text-gray-950
                mb-8
              `}
            >
              YOUR STORE
              <br />
              YOUR SPACE
              <br />
              <span className="relative inline-block">
                <span className="glitter-text">OUR DESIGN.</span>

                {/* sparkle dots */}
                <span className="absolute -top-1 right-6 text-red-400 text-xs">✦</span>
                <span className="absolute top-4 -right-2 text-red-300 text-[10px]">✦</span>
                <span className="absolute bottom-1 left-8 text-red-500 text-[10px]">✦</span>
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
