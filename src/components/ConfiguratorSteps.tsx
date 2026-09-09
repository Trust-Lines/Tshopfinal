"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ConfiguratorIcon,
  ChooseSizeIcon,
  AddToCartIcon,
} from "./icons";

const STEPS = [
  {
    step: 1,
    id: "choose",
    title: "Choose Your Store",
    desc: "Pick store type and select all the zones you need.",
    Icon: ConfiguratorIcon,
  },
  {
    step: 2,
    id: "configure",
    title: "Configure Selected Zones",
    desc: "Walk through only the zones you selected, one by one.",
    Icon: ChooseSizeIcon,
  },
  {
    step: 3,
    id: "review",
    title: "Review Your Store",
    desc: "See the combined store in 3D, check the price, and order.",
    Icon: AddToCartIcon,
  },
];

export default function ConfiguratorSteps() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D92C32] mb-1">
              Streamlined Multi-Zone Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">
              How It Works
            </h2>
          </div>
          <Link
            href="/configurator"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D92C32] hover:underline shrink-0"
          >
            Open the configurator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {STEPS.map((step) => {
            const IconComponent = step.Icon;
            return (
              <Link
                key={step.id}
                href="/configurator"
                className="group relative flex flex-col p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 hover:border-[#D92C32] hover:shadow-md transition-all duration-300"
              >
                {/* Step number — top right, no circles */}
                <span className="absolute top-5 right-6 text-3xl font-black text-gray-100 group-hover:text-red-50 transition-colors leading-none select-none">
                  {String(step.step).padStart(2, "0")}
                </span>

                {/* Icon in a clean rounded square */}
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D92C32] flex items-center justify-center mb-5 group-hover:bg-[#D92C32] group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-[#D92C32] transition-colors">
                  Start here <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}