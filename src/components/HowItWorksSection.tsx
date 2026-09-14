"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Box, ChevronRight, X, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const steps = [
    {
      id: 1,
      image: "/how_it_works_step1.png",
      alt: "Choose your store - pick from ready-made designs",
      title: "Choose your store",
      description: "Pick from ready-made designs for different store types.",
      hasBadgeOverlay: false,
    },
    {
      id: 2,
      image: "/how_it_works_step2.png",
      alt: "Set your zone size - enter available space",
      title: "Set your zone size",
      description: "Enter the space available for this zone.",
      hasBadgeOverlay: false,
    },
    {
      id: 3,
      image: "/how_it_works_step3.png",
      alt: "See it in 3D with the price - preview your zone in 3D",
      title: "See it in 3D, with the price",
      description: "Preview your zone in 3D and see the estimated price.",
      hasBadgeOverlay: true, // Step 3 image doesn't include the top red badge
    },
    {
      id: 4,
      image: "/how_it_works_step4.png",
      alt: "Place your order - review and submit",
      title: "Place your order",
      description: "Review your selections and submit your order. We’ll take care of the rest.",
      hasBadgeOverlay: false,
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Top red accent dash */}
          <div className="w-10 h-1 bg-[#d92c32] rounded-full mx-auto mb-4" />

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-gray-950 leading-tight">
            How it works
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Build your store online in four simple steps.
          </p>
        </div>

        {/* Main Grid: Left 2x2 Steps (col-span-5) vs Right Expanded Video Card (col-span-7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch mb-12 sm:mb-16">
          {/* LEFT: 2 by 2 Steps */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Circle Graphic */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-3 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-contain select-none"
                      draggable={false}
                    />

                    {/* Badge overlay for Step 3 to match the other steps */}
                    {step.hasBadgeOverlay && (
                      <div className="absolute top-[4.5%] left-1/2 -translate-x-1/2 w-[16%] aspect-square rounded-full bg-[#d92c32] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md select-none pointer-events-none">
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-950 leading-snug">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-1 text-xs sm:text-[13px] text-gray-500 leading-snug max-w-[160px] sm:max-w-[185px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Large Expanded 3D Video Preview Card */}
          <div className="lg:col-span-7 flex">
            <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] bg-white border border-gray-200/90 rounded-3xl sm:rounded-[36px] overflow-hidden shadow-sm flex items-center justify-center group p-6 sm:p-10">
              {/* Product render image */}
              <img
                src="/shelving_preview.jpg"
                alt="3D store fixture modular wall shelving system"
                className="w-full h-full max-h-[500px] object-contain select-none transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Centered Circular Play Button */}
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-10 border border-gray-100"
                aria-label="Play 3D preview video"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#d92c32] fill-current translate-x-0.5" />
              </button>

              {/* Bottom-right 3D store preview pill button */}
              <Link
                href="/configurator"
                className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 hover:bg-white hover:scale-[1.02] transition-all group/btn cursor-pointer z-10"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
                  <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                    3D store preview
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">
                    See it come to life
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button: Start building your store */}
        <div className="pt-2 sm:pt-4 flex justify-center">
          <Link
            href="/configurator"
            className="inline-flex items-center justify-center gap-2.5 px-10 sm:px-14 py-3.5 sm:py-4 rounded-full bg-[#d92c32] hover:bg-[#c4252a] active:scale-[0.98] text-white font-bold text-base sm:text-lg shadow-md shadow-red-900/15 hover:shadow-lg hover:shadow-red-900/25 transition-all duration-200 cursor-pointer"
          >
            <span>Start building your store</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Video Modal when clicking Play button */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-900 border-b border-gray-800 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Play className="w-4 h-4 text-[#d92c32] fill-current" />
                <span>3D Store Experience &amp; Interactive Fixture Preview</span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src="/store_preview.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <span>Ready to build your custom store layout online?</span>
              <Link
                href="/configurator"
                onClick={() => setIsVideoOpen(false)}
                className="px-5 py-2 rounded-full bg-[#d92c32] hover:bg-[#b91c1c] text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Launch 3D Configurator
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
