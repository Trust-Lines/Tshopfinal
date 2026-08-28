"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import {
  Search,
  ShoppingBag,
  User,
  X,
  Menu,
} from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenConfigurator: () => void;
}

export default function Header({ cartCount, onOpenCart, onOpenConfigurator }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const quickSearches = [
    "Gondola Shelving",
    "Commercial Refrigerators",
    "Checkout Counters",
    "Bakery Displays",
    "LED Track Lighting",
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[68px] flex items-center gap-4">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <a href="#" className="flex items-center shrink-0 hover:opacity-95 transition-opacity">
            <Logo variant="full" size={38} />
          </a>

          {/* ── Desktop Search Bar (md+) ─────────────────────────── */}
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search fixtures, categories, and more..."
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Quick Search Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-red-500" /> Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-red-200 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Actions ────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* "Fit Your Store" — hidden on small mobile, visible sm+ */}
            <button
              onClick={onOpenConfigurator}
              className="hidden sm:inline-flex px-4 py-2 border border-red-500 text-red-600 hover:bg-red-600 hover:text-white font-semibold text-xs rounded-lg transition-all duration-200"
            >
              Fit Your Store
            </button>

            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-[11px] text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">storemanager@tshop.com</p>
                  </div>
                  <a href="#layouts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Saved Store Layouts
                  </a>
                  <a href="#orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Fixture Orders &amp; CAD Quotes
                  </a>
                  <div className="border-t border-gray-100 mt-1" />
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Search Bar (slides down) ──────────────────── */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fixtures..."
              autoFocus
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Menu Drawer ───────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onOpenConfigurator();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Fit Your Store
          </button>
          <a href="#layouts" className="block py-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
            My Saved Store Layouts
          </a>
          <a href="#orders" className="block py-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
            Fixture Orders &amp; CAD Quotes
          </a>
        </div>
      )}
    </header>
  );
}
