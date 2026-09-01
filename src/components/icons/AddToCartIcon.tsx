import React from "react";

export function AddToCartIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Loaded Gondola Shelving Unit inside Cart */}
      {/* Gondola Frame */}
      <rect x="52" y="24" width="30" height="34" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
      {/* Red Shelves */}
      <rect x="52" y="32" width="30" height="3" fill="#D92323" stroke="#111111" strokeWidth="1.2" />
      <rect x="52" y="42" width="30" height="3" fill="#D92323" stroke="#111111" strokeWidth="1.2" />
      {/* Red Base Cabinet */}
      <rect x="50" y="49" width="34" height="9" fill="#D92323" stroke="#111111" strokeWidth="1.8" />

      {/* Wireframe Shopping Cart */}
      {/* Cart Basket Outline */}
      <path
        d="M 22 36 H 32 L 42 74 H 94 L 102 44 H 40"
        stroke="#111111"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cart Wheels */}
      <circle cx="48" cy="88" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2.8" />
      <circle cx="86" cy="88" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2.8" />
    </svg>
  );
}

export default AddToCartIcon;
