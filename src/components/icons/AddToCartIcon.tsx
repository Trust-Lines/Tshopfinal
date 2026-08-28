import React from "react";

export function AddToCartIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plus symbol top right */}
      <path
        d="M98 25V39M91 32H105"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Floating Red Accent Box above the cart */}
      <rect
        x="48"
        y="28"
        width="28"
        height="15"
        fill="#C64040"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Furniture unit wireframe inside cart */}
      <rect
        x="42"
        y="46"
        width="38"
        height="22"
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="61" y1="46" x2="61" y2="68" stroke="#111111" strokeWidth="2" />
      <line x1="42" y1="57" x2="80" y2="57" stroke="#111111" strokeWidth="2" />
      {/* Mini legs */}
      <line x1="47" y1="68" x2="47" y2="72" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="68" x2="75" y2="72" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

      {/* Shopping Cart Body */}
      {/* Handle and basket */}
      <path
        d="M18 34H26L36 74H88L96 42H30"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cart Wheels */}
      <circle cx="44" cy="88" r="6.5" stroke="#111111" strokeWidth="2.4" />
      <circle cx="82" cy="88" r="6.5" stroke="#111111" strokeWidth="2.4" />
    </svg>
  );
}

export default AddToCartIcon;
