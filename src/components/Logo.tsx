import React from "react";

interface LogoProps {
  variant?: "full" | "icon" | "stacked";
  className?: string;
  size?: number;
  theme?: "light" | "dark";
}

export function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Red Circular Background */}
      <circle cx="100" cy="100" r="92" fill="#C23B38" />

      {/* Top Left Thin Cantilever Beam */}
      <path
        d="M 34 50 L 104 80 L 104 70 L 39 42 Z"
        fill="#FFFFFF"
      />

      {/* Main Structural 'T' Mark (Left Lower Wing, Center Stem, Right Wing) */}
      <path
        d="M 40 68 
           L 86 96 
           L 86 191 
           C 90.6 191.6 95.3 192 100 192 
           C 104 192 108 191.7 112 191.2 
           L 112 96 
           L 168 64 
           L 164 54 
           L 104 80 
           L 86 80 
           L 40 58 
           Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  className = "",
  size = 42,
  theme = "light",
}: LogoProps) {
  const isDark = theme === "dark";

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <LogoIcon className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem */}
      <div style={{ width: size, height: size }} className="shrink-0 flex items-center justify-center">
        <LogoIcon className="w-full h-full" />
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-tight text-[22px] sm:text-[24px] leading-none ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          T Shop
        </span>
        <span
          className={`text-[13px] sm:text-[14px] font-normal tracking-tight leading-tight mt-0.5 ${
            isDark ? "text-zinc-300" : "text-neutral-900"
          }`}
        >
          Online Store
        </span>
      </div>
    </div>
  );
}
