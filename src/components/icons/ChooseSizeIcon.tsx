import React from "react";

export function ChooseSizeIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Red Vertical Double-Headed Dimension Arrow (Height) */}
      <path d="M 26 28 V 84" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 21 34 L 26 26 L 31 34" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 21 78 L 26 86 L 31 78" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Red Horizontal Double-Headed Dimension Arrow (Width) */}
      <path d="M 40 96 H 96" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 46 91 L 38 96 L 46 101" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 90 91 L 98 96 L 90 101" stroke="#D92323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* 3D Gondola Shelving Unit in Center */}
      {/* Base block */}
      <path d="M 44 72 L 54 67 L 94 67 L 84 72 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="44" y="72" width="40" height="10" fill="#FFFFFF" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 84 72 L 94 67 V 77 L 84 82 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />

      {/* Back panel / Uprights */}
      <path d="M 44 26 H 54 V 67 H 44 Z" fill="#FFFFFF" stroke="#111111" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 54 26 L 64 21 V 62 L 54 67 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="2" strokeLinejoin="round" />

      {/* Shelves (3 tiers) */}
      {/* Top Shelf */}
      <rect x="54" y="33" width="36" height="4" fill="#FFFFFF" stroke="#111111" strokeWidth="1.8" />
      <path d="M 90 33 L 96 30 V 34 L 90 37 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="1.8" />

      {/* Middle Shelf */}
      <rect x="54" y="46" width="37" height="4" fill="#FFFFFF" stroke="#111111" strokeWidth="1.8" />
      <path d="M 91 46 L 97 43 V 47 L 91 50 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="1.8" />

      {/* Bottom Shelf */}
      <rect x="54" y="59" width="38" height="4" fill="#FFFFFF" stroke="#111111" strokeWidth="1.8" />
      <path d="M 92 59 L 98 56 V 60 L 92 63 Z" fill="#E5E7EB" stroke="#111111" strokeWidth="1.8" />
    </svg>
  );
}

export default ChooseSizeIcon;
