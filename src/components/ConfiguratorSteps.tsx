"use client";

import React from "react";
import {
  ConfiguratorIcon,
  ChooseSizeIcon,
  SelectColorIcon,
  AddToCartIcon,
} from "./icons";

interface ConfiguratorStepsProps {
  onOpenConfigurator?: () => void;
}

const STEPS = [
  {
    id: "zone",
    title: " Pick a zone",
    Icon: ConfiguratorIcon,
    action: true,
  },
  {
    id: "dimensions",
    title: " Enter your dimensions",
    Icon: ChooseSizeIcon,
    action: true,
  },
  {
    id: "3d-price",
    title: " See it in 3D, with the price",
    Icon: SelectColorIcon,
    action: true,
  },
  {
    id: "order",
    title: "Place your order",
    Icon: AddToCartIcon,
    action: true,
  },
];

export default function ConfiguratorSteps({ onOpenConfigurator }: ConfiguratorStepsProps) {
  return (
    <section className="w-full bg-[#ECECEC] py-14 sm:py-18">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-6 md:gap-3 lg:gap-8">
          {STEPS.map((step, index) => {
            const IconComponent = step.Icon;
            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div
                  onClick={onOpenConfigurator}
                  className="flex flex-col items-center text-center group cursor-pointer w-full md:w-auto"
                >
                  {/* Circular Icon Container */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md relative shadow-2xs">
                    <IconComponent className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-3 sm:mt-5 text-xs sm:text-sm lg:text-base font-semibold text-gray-900 tracking-tight group-hover:text-[#D92323] transition-colors max-w-[160px]">
                    {step.title}
                  </h3>
                </div>

                {/* Arrow Connector (between steps, desktop lg+ only) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-slate-400 -mt-8 shrink-0">
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
