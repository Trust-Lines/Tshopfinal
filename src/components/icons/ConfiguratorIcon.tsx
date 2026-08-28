import React from "react";

export function ConfiguratorIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Browser window frame */}
      <rect
        x="18"
        y="24"
        width="76"
        height="64"
        rx="4"
        stroke="#111111"
        strokeWidth="2.2"
      />
      {/* Top Header line */}
      <line x1="18" y1="38" x2="94" y2="38" stroke="#111111" strokeWidth="2.2" />
      {/* 3 browser dots */}
      <circle cx="26" cy="31" r="2.2" fill="#111111" />
      <circle cx="33" cy="31" r="2.2" fill="#111111" />
      <circle cx="40" cy="31" r="2.2" fill="#111111" />

      {/* Plus symbol top right */}
      <path
        d="M98 33H108M103 28V38"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Modular Furniture Inside */}
      {/* Left red accented cabinet */}
      <rect
        x="28"
        y="48"
        width="18"
        height="32"
        fill="#C64040"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right cabinet */}
      <rect
        x="46"
        y="48"
        width="38"
        height="32"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Inner grid lines */}
      <line x1="65" y1="48" x2="65" y2="80" stroke="#111111" strokeWidth="2.2" />
      <line x1="46" y1="64" x2="84" y2="64" stroke="#111111" strokeWidth="2.2" />
      {/* Cabinet legs */}
      <line x1="33" y1="80" x2="33" y2="86" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="79" y1="80" x2="79" y2="86" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default ConfiguratorIcon;
