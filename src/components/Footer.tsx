"use client";

import React from "react";
import Logo from "./Logo";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-400 pt-16 pb-12 border-t border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <Logo variant="full" theme="dark" size={38} />
            </a>
            <p className="text-sm text-gray-400 max-w-sm">
              Retail fixtures built to fit your store. Heavy-duty modular shelving, commercial refrigeration, and POS counters designed for maximum store profitability.
            </p>

            <div className="pt-2 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>100 Retail Way, Industrial Park, Suite 400</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>1-800-TSHOP-STORE (1-800-874-6778)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@tshopstore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Store Fixtures
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Gondola Island Shelving</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wall Display Racks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commercial Coolers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Checkout POS Counters</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Produce & Bakery Baskets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LED Track Lighting</a></li>
            </ul>
          </div>

          {/* 3D Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              3D Layout Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Fit Your Store Configurator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Download CAD Blueprints</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Store Transformation Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Installation Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty & Assembly</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Get store optimization tips & exclusive fixture discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} T Shop Online Store. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Shipping Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
