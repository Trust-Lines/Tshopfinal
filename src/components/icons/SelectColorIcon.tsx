import React from "react";

export function SelectColorIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 3 Color Swatch Circles on Top */}
      {/* Red swatch */}
      <circle cx="36" cy="32" r="8.5" fill="#C64040" stroke="#111111" strokeWidth="2.2" />
      {/* Black swatch */}
      <circle cx="60" cy="32" r="8.5" fill="#111111" stroke="#111111" strokeWidth="2.2" />
      {/* Light Gray / White swatch */}
      <circle cx="84" cy="32" r="8.5" fill="#EAEAEA" stroke="#111111" strokeWidth="2.2" />

      {/* Modular Furniture Unit */}
      {/* Left red accented cabinet */}
      <rect
        x="30"
        y="50"
        width="18"
        height="32"
        fill="#C64040"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right cabinet */}
      <rect
        x="48"
        y="50"
        width="38"
        height="32"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Inner grid lines */}
      <line x1="67" y1="50" x2="67" y2="82" stroke="#111111" strokeWidth="2.2" />
      <line x1="48" y1="66" x2="86" y2="66" stroke="#111111" strokeWidth="2.2" />
      {/* Legs */}
      <line x1="35" y1="82" x2="35" y2="88" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="81" y1="82" x2="81" y2="88" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default SelectColorIcon;
