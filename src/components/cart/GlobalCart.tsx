"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, X, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";

// Small "added to cart" notice that links to the full cart page.
export default function GlobalCart() {
  const { addedNotice, dismissNotice, count } = useCart();
  const pathname = usePathname();
  const onCartFlow = pathname === "/cart" || pathname === "/order";

  useEffect(() => {
    if (!addedNotice) return;
    const t = setTimeout(dismissNotice, 4000);
    return () => clearTimeout(t);
  }, [addedNotice, dismissNotice]);

  if (!addedNotice || onCartFlow) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-950">Added to your cart</p>
        <p className="text-xs text-gray-600 mt-0.5">{count} items in your store layout</p>
        <Link
          href="/cart"
          onClick={dismissNotice}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#D92323] hover:underline"
        >
          <span>View cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <button
        type="button"
        onClick={dismissNotice}
        aria-label="Dismiss"
        className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
