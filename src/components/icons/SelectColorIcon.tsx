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
      <circle cx="38" cy="18" r="7.5" fill="#D92323" />
      {/* White circle 1 */}
      <circle cx="58" cy="18" r="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
      {/* White circle 2 */}
      <circle cx="78" cy="18" r="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />

      {/* 3D Glass Display Case with Red Shelves */}
      {/* Back Wall of Glass Case */}
      <path d="M 48 32 H 88 V 72 L 74 80 H 34 V 40 Z" fill="#F8FAFC" />
      
      {/* Outer 3D Glass Frame Outlines */}
      <path d="M 34 40 L 48 32 H 88 L 74 40 V 80 L 34 80 Z" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 88 32 V 72 L 74 80" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 48 32 V 72 L 34 80" stroke="#111111" strokeWidth="1.8" strokeDasharray="3 3" />

      {/* 3 Tier Red Shelves */}
      {/* Top Shelf */}
      <path d="M 36 48 L 46 43 H 84 L 74 48 Z" fill="#D92323" stroke="#111111" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="36" y="48" width="38" height="3.5" fill="#D92323" stroke="#111111" strokeWidth="1.8" />

      {/* Middle Shelf */}
      <path d="M 36 60 L 46 55 H 84 L 74 60 Z" fill="#D92323" stroke="#111111" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="36" y="60" width="38" height="3.5" fill="#D92323" stroke="#111111" strokeWidth="1.8" />

      {/* Bottom Shelf */}
      <path d="M 36 72 L 46 67 H 84 L 74 72 Z" fill="#D92323" stroke="#111111" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="36" y="72" width="38" height="3.5" fill="#D92323" stroke="#111111" strokeWidth="1.8" />

      {/* Price Tag Badge Overlay ($ $$$) */}
      <g transform="translate(50, 72)">
        <rect x="0" y="0" width="54" height="22" rx="11" fill="#FFFFFF" stroke="#111111" strokeWidth="2.2" />
        <text
          x="27"
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="13"
          fontWeight="800"
          letterSpacing="0.5"
        >
          <tspan fill="#D92323">$ </tspan>
          <tspan fill="#111111">$$$</tspan>
        </text>
      </g>
    </svg>
  );
}

export default SelectColorIcon;
