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
    id: "configurator",
    title: "Open the Configurator",
    Icon: ConfiguratorIcon,
    action: true,
  },
  {
    id: "sizes",
    title: "Choose sizes",
    Icon: ChooseSizeIcon,
    action: true,
  },
  {
    id: "colors",
    title: "Select your color",
    Icon: SelectColorIcon,
    action: true,
  },
  {
    id: "cart",
    title: "Add to cart",
    Icon: AddToCartIcon,
    action: true,
  },
];

export default function ConfiguratorSteps({ onOpenConfigurator }: ConfiguratorStepsProps) {
  return (
    <section className="w-full bg-white py-14 sm:py-18 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 lg:gap-8">
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
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#F4F4F6] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:bg-[#EFEFF2] relative">
                    <IconComponent className="w-24 h-24 sm:w-28 sm:h-28 transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-5 text-sm sm:text-base font-semibold text-gray-900 tracking-tight group-hover:text-red-600 transition-colors">
                    {step.title}
                  </h3>
                </div>

                {/* Arrow Connector (between steps, desktop only) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-gray-300 -mt-8 shrink-0">
                    <svg
                      width="36"
                      height="20"
                      viewBox="0 0 36 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-300"
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
