"use client";

import React from "react";
import Logo from "./Logo";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fbfaf8] text-stone-600 pt-16 pb-12 border-t border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-200/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <Logo variant="full" theme="light" height={38} />
            </a>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              Retail fixtures built to fit your store. Heavy-duty modular shelving, commercial refrigeration, and POS counters designed for maximum store profitability.
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c14040] shrink-0" />
                <span>100 Retail Way, Industrial Park, Suite 400</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c14040] shrink-0" />
                <span>1-800-TSHOP-STORE (1-800-874-6778)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c14040] shrink-0" />
                <span>support@tshopstore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Store Fixtures
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Gondola Island Shelving</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Wall Display Racks</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Commercial Coolers</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Checkout POS Counters</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Produce & Bakery Baskets</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">LED Track Lighting</a></li>
            </ul>
          </div>

          {/* 3D Services */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              3D Layout Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Fit Your Store Configurator</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Download CAD Blueprints</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Store Transformation Portfolio</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Installation Guides</a></li>
              <li><a href="#" className="hover:text-[#c14040] transition-colors">Warranty & Assembly</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-stone-600 mb-3 leading-relaxed">
              Get store optimization tips & exclusive fixture discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#c14040] focus:border-[#c14040] transition-all"
              />
              <button className="p-2.5 bg-[#c14040] hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} T Shop Online Store. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Shipping Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
