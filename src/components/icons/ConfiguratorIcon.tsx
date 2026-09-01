import React from "react";

export function ConfiguratorIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Room Boundary Walls with Entrance Gap on right */}
      <path
        d="M 98 62 V 96 H 22 V 22 H 98 V 52"
        stroke="#111111"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Inner Wall Detail */}
      <path
        d="M 92 62 V 90 H 28 V 28 H 92 V 52"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinecap="square"
      />

      {/* Left Aisle Fixtures (5 stacked shelf units) */}
      <rect x="34" y="34" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="34" y="45" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="34" y="56" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="34" y="67" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="34" y="78" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />

      {/* Center Selected Zone Island (2 RED filled vertical rectangles) */}
      <rect x="55" y="44" width="10" height="28" fill="#D92323" stroke="#111111" strokeWidth="2" />
      <rect x="65" y="44" width="10" height="28" fill="#D92323" stroke="#111111" strokeWidth="2" />

      {/* Right Aisle Fixtures (5 stacked shelf units) */}
      <rect x="80" y="34" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="80" y="45" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="80" y="56" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="80" y="67" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
      <rect x="80" y="78" width="16" height="8" stroke="#111111" strokeWidth="2" fill="#FFFFFF" />
    </svg>
  );
}

export default ConfiguratorIcon;
