"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Play } from "lucide-react";

export default function HeroSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* Split Hero: Text on Left, Video Preview on Right */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

          {/* LEFT — Text Content */}
          <div className="w-full lg:w-[48%] flex flex-col items-start text-left">

            {/* Spacing preserved from removed Highlights badge */}
            <div className="h-[48px] sm:h-[58px]" aria-hidden="true" />

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-normal tracking-[-0.02em] text-[#141414] leading-[1.08] mb-5">
              Design your<br />
              whole store<br />
              online in 10<br />
              minutes.
            </h1>

            {/* Subtitle */}
            <div className="text-sm sm:text-base text-[#525252] leading-relaxed mb-8 sm:mb-10 max-w-lg">
              <p>Enter your dimensions, choose your look, see it priced.</p>
              <p>No designer, no quote wait.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {/* How it works (Outlined Pill) */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 border-[#b93838] text-[#b93838] hover:bg-red-50/70 active:scale-[0.98] font-medium text-sm sm:text-base transition-all duration-150 cursor-pointer inline-flex items-center justify-center"
              >
                How it works
              </button>

              {/* Plan your store (Solid Red Pill) */}
              <Link
                href="/configurator"
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#b93838] hover:bg-[#a53030] active:scale-[0.98] text-white font-medium text-sm sm:text-base transition-all duration-150 shadow-sm inline-flex items-center justify-center"
              >
                Plan your store
              </Link>
            </div>

          </div>

          {/* RIGHT — Clean Video Preview (No shades, no borders, no overlay shapes) */}
          <div className="w-full lg:w-[52%] flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] overflow-hidden flex items-center justify-center">
              <video
                src="/store_preview.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tutorial Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-900 border-b border-gray-800 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Play className="w-4 h-4 text-[#b93838] fill-current" />
                <span>T Shop Store Design Tutorial</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
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
              <span>Ready to plan your store layout in real time?</span>
              <Link
                href="/configurator"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#b93838] hover:bg-[#a53030] text-white font-medium text-xs transition-colors"
              >
                Launch Store Configurator
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
