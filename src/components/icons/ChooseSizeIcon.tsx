import React from "react";

export function ChooseSizeIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dashed bounding box */}
      <rect
        x="24"
        y="24"
        width="72"
        height="72"
        stroke="#111111"
        strokeWidth="2"
        strokeDasharray="5 5"
      />

      {/* 4 Corner handles (anchors) */}
      <rect x="21" y="21" width="6" height="6" fill="#111111" />
      <rect x="93" y="21" width="6" height="6" fill="#111111" />
      <rect x="21" y="93" width="6" height="6" fill="#111111" />
      <rect x="93" y="93" width="6" height="6" fill="#111111" />

      {/* Modular Furniture Inside */}
      {/* Left red accented cabinet */}
      <rect
        x="30"
        y="50"
        width="16"
        height="28"
        fill="#C64040"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right cabinet */}
      <rect
        x="46"
        y="50"
        width="34"
        height="28"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Inner lines */}
      <line x1="63" y1="50" x2="63" y2="78" stroke="#111111" strokeWidth="2.2" />
      <line x1="46" y1="64" x2="80" y2="64" stroke="#111111" strokeWidth="2.2" />
      {/* Legs */}
      <line x1="34" y1="78" x2="34" y2="84" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="76" y1="78" x2="76" y2="84" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />

      {/* Diagonal Resize Arrow (top-right) */}
      <path
        d="M74 46L91 29M91 29H80M91 29V40M74 46L85 46M74 46V35"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChooseSizeIcon;
