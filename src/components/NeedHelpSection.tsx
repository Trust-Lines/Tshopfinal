"use client";

import React, { useState } from "react";
import { Mail, Phone, Clock, MessageSquare, X, Check } from "lucide-react";

export default function NeedHelpSection() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsContactModalOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 2000);
  };

  return (
    <section className="relative w-full bg-[#b93838] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden select-none">
      {/* Background Concentric Circular Ripples with Center Fade Mask */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ripple-mask-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" />
            <stop offset="22%" stopColor="white" />
            <stop offset="34%" stopColor="black" />
            <stop offset="66%" stopColor="black" />
            <stop offset="78%" stopColor="white" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask id="ripple-center-mask">
            <rect width="100%" height="100%" fill="url(#ripple-mask-grad)" />
          </mask>
        </defs>

        {/* Group with Mask Applied to keep Center Clean across all screen widths */}
        <g mask="url(#ripple-center-mask)" stroke="rgba(0, 0, 0, 0.14)" strokeWidth="1.5" fill="none">
          {/* Left Concentric Arcs */}
          <circle cx="0%" cy="50%" r="80" />
          <circle cx="0%" cy="50%" r="160" />
          <circle cx="0%" cy="50%" r="240" />
          <circle cx="0%" cy="50%" r="320" />
          <circle cx="0%" cy="50%" r="400" />
          <circle cx="0%" cy="50%" r="480" />
          <circle cx="0%" cy="50%" r="560" />
          <circle cx="0%" cy="50%" r="640" />

          {/* Right Concentric Arcs */}
          <circle cx="100%" cy="50%" r="80" />
          <circle cx="100%" cy="50%" r="160" />
          <circle cx="100%" cy="50%" r="240" />
          <circle cx="100%" cy="50%" r="320" />
          <circle cx="100%" cy="50%" r="400" />
          <circle cx="100%" cy="50%" r="480" />
          <circle cx="100%" cy="50%" r="560" />
          <circle cx="100%" cy="50%" r="640" />
        </g>
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Spacing preserved from removed Talk to us badge */}
        <div className="h-9 sm:h-10" aria-hidden="true" />

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-semibold text-white tracking-tight leading-tight mb-2 sm:mb-3 px-2">
          Need help with your order?
        </h2>

        {/* Subtitle */}
        <p className="text-white/90 text-xs sm:text-sm md:text-base font-normal max-w-md sm:max-w-lg mb-6 sm:mb-8 px-4">
          Don&apos;t hesitate to give us a call or send an email
        </p>

        {/* CTA Button */}
        <div>
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            className="px-7 sm:px-10 py-2.5 sm:py-3.5 bg-white text-[#b93838] hover:bg-gray-50 active:scale-[0.98] font-bold text-xs sm:text-sm md:text-base rounded-full shadow-lg shadow-black/15 transition-all duration-150 cursor-pointer"
          >
            Get in Touch
          </button>
        </div>

      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#b93838] mx-auto flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Our retail fixture specialists are here to assist with store layouts &amp; orders.
              </p>
            </div>

            {/* Direct Contact Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <a
                href="tel:+18005558746"
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-[#b93838] hover:bg-red-50/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-red-100 text-[#b93838] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 font-semibold">Call Toll Free</p>
                  <p className="text-xs font-bold text-gray-900">1 (800) 555-TSHOP</p>
                </div>
              </a>

              <a
                href="mailto:support@tshop.com"
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-[#b93838] hover:bg-red-50/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-red-100 text-[#b93838] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 font-semibold">Direct Email</p>
                  <p className="text-xs font-bold text-gray-900">support@tshop.com</p>
                </div>
              </a>
            </div>

            {/* Quick Contact Form */}
            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-emerald-900">Message Received!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  A store specialist will contact you within 1 business hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b93838]/30 focus:border-[#b93838] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b93838]/30 focus:border-[#b93838] transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b93838]/30 focus:border-[#b93838] transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we help with your fixtures or store layout?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b93838]/30 focus:border-[#b93838] transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mon - Fri, 8am - 7pm EST</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#b93838] hover:bg-[#a53030] text-white font-bold text-xs sm:text-sm rounded-full transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
