"use client";

import React, { useState } from "react";
import { X, Check, Download, Layers, Ruler, DollarSign, Store, ArrowRight, RefreshCw } from "lucide-react";

interface StoreConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (items: any[]) => void;
}

export default function StoreConfigurator({ isOpen, onClose, onAddToCart }: StoreConfiguratorProps) {
  const [storeType, setStoreType] = useState("convenience");
  const [squareFeet, setSquareFeet] = useState(1200);
  const [includeRefrigeration, setIncludeRefrigeration] = useState(true);
  const [includePOS, setIncludePOS] = useState(true);
  const [woodFinish, setWoodFinish] = useState("natural_oak");

  if (!isOpen) return null;

  // Price calculations based on parameters
  const baseCostPerSqFt = storeType === "supermarket" ? 3.5 : storeType === "boutique" ? 4.2 : 2.8;
  const estimatedFixturesCost = Math.round(squareFeet * baseCostPerSqFt + (includeRefrigeration ? 3500 : 0) + (includePOS ? 1800 : 0));
  const estimatedGondolas = Math.round(squareFeet / 120);
  const estimatedWallRacks = Math.round(squareFeet / 80);

  const handleApplyToCart = () => {
    const bundleItems = [
      {
        id: `config_gondolas_${Date.now()}`,
        title: `Gondola Shelving Package (${estimatedGondolas} units - ${woodFinish.replace('_', ' ')})`,
        price: estimatedGondolas * 450,
        image: "/gondola_shelving.jpg",
        quantity: 1
      },
      ...(includeRefrigeration ? [{
        id: `config_refr_${Date.now()}`,
        title: "Commercial Multi-Door Cooler Unit",
        price: 3500,
        image: "/commercial_fridge.jpg",
        quantity: 1
      }] : []),
      ...(includePOS ? [{
        id: `config_pos_${Date.now()}`,
        title: "Modular POS Checkout Counter",
        price: 1800,
        image: "/gondola_shelving.jpg",
        quantity: 1
      }] : [])
    ];
    onAddToCart(bundleItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">
              Fit Your Store — 3D Layout Configurator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Calculate exact fixture dimensions, pricing, and 3D layout instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Store Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                1. Select Store Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "convenience", label: "Convenience Store" },
                  { id: "supermarket", label: "Supermarket" },
                  { id: "boutique", label: "Boutique / Apparel" },
                  { id: "bakery", label: "Bakery & Cafe" },
                  { id: "pharmacy", label: "Pharmacy" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setStoreType(type.id)}
                    className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                      storeType === type.id
                        ? "border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm"
                        : "border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Store Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-red-600" /> 2. Total Store Floor Area
                </label>
                <span className="text-sm font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full">
                  {squareFeet.toLocaleString()} sq ft
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="5000"
                step="100"
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>400 sq ft (Compact)</span>
                <span>2,500 sq ft (Medium)</span>
                <span>5,000 sq ft (Large)</span>
              </div>
            </div>

            {/* Step 3: Wood & Steel Finish */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                3. Wood & Frame Finish
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "natural_oak", label: "Natural Oak" },
                  { id: "walnut", label: "Warm Walnut" },
                  { id: "black_steel", label: "Matte Black & Pine" },
                ].map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setWoodFinish(finish.id)}
                    className={`p-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      woodFinish === finish.id
                        ? "border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                        : "border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {finish.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Optional Fixture Packages */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                4. Essential Add-On Packages
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeRefrigeration}
                      onChange={(e) => setIncludeRefrigeration(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Commercial Refrigeration Wall</span>
                      <p className="text-xs text-gray-500">Multi-door LED display coolers for chilled drinks & dairy</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">+$3,500</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includePOS}
                      onChange={(e) => setIncludePOS(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Modular Checkout Counter & POS Stand</span>
                      <p className="text-xs text-gray-500">Ergonomic cashier desk with impulse racks & cable routing</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">+$1,800</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Quote Summary & Plan */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-6 border border-gray-200/80 dark:border-zinc-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-700">
                <span className="text-xs font-bold text-gray-400 uppercase">Estimated Layout</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  CAD Ready
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Gondola Island Racks</span>
                  <span className="font-bold text-gray-900 dark:text-white">{estimatedGondolas} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Wall Shelving Racks</span>
                  <span className="font-bold text-gray-900 dark:text-white">{estimatedWallRacks} bays</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Est. Installation Time</span>
                  <span className="font-bold text-gray-900 dark:text-white">2 - 3 Days</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 mt-4">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Estimated Fixture Package</span>
                <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
                  ${estimatedFixturesCost.toLocaleString()}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Includes free 3D CAD schematic & store layout consultation.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleApplyToCart}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Add Store Package to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert("Downloading 3D CAD Floorplan blueprint PDF...")}
                className="w-full py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download 3D Blueprint (.PDF)
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
