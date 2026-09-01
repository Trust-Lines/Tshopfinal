import React from "react";

export function SelectColorIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top 3 Color Swatch Circles */}
      {/* Red circle (Selected) */}
      <circle cx="42" cy="22" r="7" fill="#D92323" />
      {/* White circle 1 */}
      <circle cx="60" cy="22" r="6.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.8" />
      {/* White circle 2 */}
      <circle cx="78" cy="22" r="6.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.8" />

      {/* 3D Glass Display Case with Red Shelves */}
      {/* Glass outer box 3D outline */}
      <path d="M 36 42 L 50 34 H 92 L 78 42 V 82 L 36 82 Z" fill="#F9FAFB" fillOpacity="0.6" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 92 34 V 74 L 78 82" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 50 34 V 74 L 36 82" stroke="#111111" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Red Shelves inside 3D Glass Case */}
      {/* Shelf 1 (Top) */}
      <path d="M 40 52 L 48 48 H 84 L 76 52 Z" fill="#D92323" stroke="#111111" strokeWidth="1.5" />
      {/* Shelf 2 (Middle) */}
      <path d="M 40 64 L 48 60 H 84 L 76 64 Z" fill="#D92323" stroke="#111111" strokeWidth="1.5" />
      {/* Shelf 3 (Bottom) */}
      <path d="M 40 76 L 48 72 H 84 L 76 76 Z" fill="#D92323" stroke="#111111" strokeWidth="1.5" />

      {/* Price Tag Badge Overlay ($ $$$) */}
      <rect x="58" y="78" width="46" height="18" rx="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
      <text x="64" y="91" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#D92323">$</text>
      <text x="74" y="91" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#111111">$$$</text>
    </svg>
  );
}

export default SelectColorIcon;
