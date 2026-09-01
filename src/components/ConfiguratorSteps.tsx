"use client";

import React from "react";
import Link from "next/link";
import {
  ConfiguratorIcon,
  ChooseSizeIcon,
  SelectColorIcon,
  AddToCartIcon,
} from "./icons";

const STEPS = [
  {
    id: "zone",
    title: "Pick a zone",
    Icon: ConfiguratorIcon,
  },
  {
    id: "dimensions",
    title: "Enter your dimensions",
    Icon: ChooseSizeIcon,
  },
  {
    id: "3d-price",
    title: "See it in 3D, with the price",
    Icon: SelectColorIcon,
  },
  {
    id: "order",
    title: "Place your order",
    Icon: AddToCartIcon,
  },
];

export default function ConfiguratorSteps() {
  return (
    <section className="w-full bg-[#ECECEC] py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:items-start md:justify-between gap-8 md:gap-4 lg:gap-6">
          {STEPS.map((step, index) => {
            const IconComponent = step.Icon;
            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <Link
                  href="/configurator"
                  className="flex flex-col items-center text-center group cursor-pointer w-full md:w-auto"
                >
                  {/* Circular Icon Container */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md relative shadow-2xs shrink-0">
                    <IconComponent className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base font-semibold text-gray-950 tracking-tight leading-snug group-hover:text-[#D92323] transition-colors max-w-[150px] sm:max-w-[180px]">
                    {step.title}
                  </h3>
                </Link>

                {/* Arrow Connector (between steps, desktop lg+ only) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-slate-400 self-start mt-16 shrink-0">
                    <svg
                      width="36"
                      height="20"
                      viewBox="0 0 36 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-slate-400"
                    >
                      <path
                        d="M2 10H34M34 10L25 2M34 10L25 18"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
