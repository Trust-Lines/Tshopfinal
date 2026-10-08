"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart, CartItem } from "@/components/cart/CartContext";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Info,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Truck,
  Check,
} from "lucide-react";

// Default preset fixtures matching the configured 7-item layout if cart is empty
const PRESET_FIXTURES: CartItem[] = [
  {
    id: "prod-1",
    title: "Modular Double-Sided Wooden Gondola Shelving",
    price: 890,
    image: "/gondola_shelving.jpg",
    quantity: 1,
  },
  {
    id: "prod-3",
    title: "Ergonomic Supermarket Checkout Counter & POS Desk",
    price: 1450,
    image: "/store_3d_preview.jpg",
    quantity: 1,
  },
  {
    id: "cf-front-checkout",
    title: "Front Checkout (C-Store) — 12'L · 4 fixtures · 34″ Showcase",
    price: 2640,
    image: "/cashier_counter.jpg",
    quantity: 1,
  },
  {
    id: "cf-back-counter",
    title: "Back Counter (C-Store) — 10'L · 3 fixtures · 36″ Standard",
    price: 1572,
    image: "/cashier_counter.jpg",
    quantity: 1,
  },
  {
    id: "cf-coffee-counter",
    title: "Coffee Counter (C-Store) — 10'L · 4 fixtures · 36″ Standard",
    price: 2240,
    image: "/coffee_island.jpg",
    quantity: 1,
  },
  {
    id: "cf-gondola-shelving",
    title: "Gondola Shelving (C-Store) — 22'L · 6 fixtures · 53″ Standard",
    price: 3280,
    image: "/gondola_shelving_unit.jpg",
    quantity: 1,
  },
  {
    id: "cf-jewellery-showcases",
    title: "Jewellery Showcases (C-Store) — 12'L · 4 fixtures · 34″ Showcase",
    price: 3650,
    image: "/store_type_jewellery.jpg",
    quantity: 1,
  },
];

const PRESET_TOTAL = PRESET_FIXTURES.reduce((acc, it) => acc + it.price * it.quantity, 0);

type DeliveryMethod = "standard" | "inside" | "installation" | "pickup";

const DELIVERY_OPTIONS: { id: DeliveryMethod; label: string; description: string; price: string }[] = [
  { id: "standard", label: "Standard Freight", description: "Delivered to your store or loading dock.", price: "From $480" },
  { id: "inside", label: "Inside Delivery", description: "Fixtures brought inside your store and packaging removed.", price: "From $980" },
  { id: "installation", label: "Installation", description: "Delivery plus professional fixture installation.", price: "From $1,850" },
];

const PICKUP_OPTION = {
  id: "pickup" as const,
  label: "Terminal Pickup",
  description: "Collect your order from one of our regional freight terminals.",
  price: "Free",
};

const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  standard: "Standard Freight",
  inside: "Inside Delivery",
  installation: "Installation",
  pickup: "Terminal Pickup",
};

// Cart titles look like "Front Checkout (C-Store) — 12'L · 4 fixtures · 34″ Showcase".
// Show the zone name and count its fixtures; plain products count as one fixture per unit.
function toZone(item: CartItem) {
  const name = item.title.split(" — ")[0].replace(/\s*\([^)]*\)\s*$/, "").trim();
  const match = item.title.match(/(\d+)\s+fixtures?/i);
  const fixtures = (match ? Number(match[1]) : 1) * item.quantity;
  return { id: item.id, name, fixtures, total: item.price * item.quantity };
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]";
const labelClass = "block text-xs font-bold text-gray-800 mb-1.5";

function SectionHeader({ step, title, subtitle, icon }: { step: number; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D92323] flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-gray-950">{title}</h2>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
      <span className="text-gray-600">{icon}</span>
    </div>
  );
}

export default function OrderPage() {
  const { items, addBundle } = useCart();

  const [formData, setFormData] = useState({
    firstName: "Marcus",
    lastName: "Vance",
    companyName: "Metro Retail Group LLC",
    email: "marcus.vance@metroretailgroup.com",
    phone: "(512) 840-2911",
    streetAddress: "4820 South Congress Ave, Building 4",
    city: "Austin",
    state: "TX",
    zipCode: "78745",
    targetOpeningDate: "",
    deliveryNotes: "",
  });
  const [hasLoadingDock, setHasLoadingDock] = useState<boolean | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteNumber] = useState("TS-84921");

  const zones = items.map(toZone);
  const fixtureCount = zones.reduce((acc, z) => acc + z.fixtures, 0);
  const fixtureTotal = zones.reduce((acc, z) => acc + z.total, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const handleLoadPresetBundle = () => {
    addBundle(PRESET_FIXTURES, { open: false });
  };

  const renderDeliveryOption = (option: { id: DeliveryMethod; label: string; description: string; price: string }) => {
    const selected = deliveryMethod === option.id;
    return (
      <label
        key={option.id}
        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
          selected ? "border-[#D92323] bg-red-50/20 shadow-xs" : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <input
            type="radio"
            name="deliveryMethod"
            value={option.id}
            checked={selected}
            onChange={() => setDeliveryMethod(option.id)}
            className="sr-only"
          />
          <span
            aria-hidden
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
              selected ? "border-[#D92323] bg-[#D92323]" : "border-gray-400"
            }`}
          >
            {selected && <span className="w-2 h-2 rounded-full bg-white" />}
          </span>
          <div>
            <span className="text-sm font-bold text-gray-950">{option.label}</span>
            <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
          </div>
        </div>
        <span className="text-sm font-extrabold text-gray-950 shrink-0">{option.price}</span>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-gray-900 font-sans flex flex-col">
      {/* ── Header ─────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="hover:opacity-95 transition-opacity">
                <Logo variant="full" height={36} showSubtitle={true} />
              </Link>
              <div className="hidden md:block h-6 w-px bg-gray-200" />
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                <span>Request a Quote</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-800">No payment required</span>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#D92323]">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-700">Project Support</div>
                  <div className="text-xs font-bold text-gray-900">(800) 555-0199</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sub-header / Progress Stepper ──────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/configurator"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#D92323] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 3D Store Configurator</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Design Store</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`flex items-center gap-1.5 ${isSubmitted ? "text-emerald-700" : "text-[#D92323]"}`}>
              {isSubmitted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-[#D92323] text-white flex items-center justify-center text-[10px]">2</span>
              )}
              <span>2. Your Details</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`flex items-center gap-1.5 ${isSubmitted ? "text-[#D92323]" : "text-gray-600"}`}>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isSubmitted ? "bg-[#D92323] text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                3
              </span>
              <span>3. Final Quote</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {isSubmitted ? (
          /* ── Quote Request Received ── */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quote Request Received</h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-md mx-auto">
                Thanks, {formData.firstName}. Request <span className="font-mono font-bold text-white">#{quoteNumber}</span> is with our team.
              </p>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex items-start gap-3 bg-gray-50 p-5 rounded-xl border border-gray-200/80">
                <Mail className="w-5 h-5 text-[#D92323] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  We&apos;ll email your formal quote to <span className="font-bold text-gray-950">{formData.email}</span>, including final
                  freight, installation, taxes and any project-specific adjustments. Nothing is charged until you approve it.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-600 block">Your Store</span>
                  <span className="font-bold text-gray-900">
                    {zones.length} Zones · {fixtureCount} Fixtures
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block">Delivery</span>
                  <span className="font-bold text-gray-900">{DELIVERY_LABELS[deliveryMethod]}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Estimated Fixture Total</span>
                  <span className="font-bold text-gray-900">${fixtureTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-[#D92323] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98"
                >
                  Return to Store Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT COLUMN: Contact, Delivery, Delivery Method ── */}
            <div className="lg:col-span-7 space-y-6">
              {items.length === 0 && (
                <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Your store layout has no fixtures yet.</h4>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Load the recommended 7-fixture layout (${PRESET_TOTAL.toLocaleString()}) or design your own.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadPresetBundle}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                  >
                    Load Layout
                  </button>
                </div>
              )}

              {/* Section 1: Contact & Business */}
              <section className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <SectionHeader
                  step={1}
                  title="Contact & Business"
                  subtitle="Who should we send your quote to?"
                  icon={<Building2 className="w-5 h-5" />}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input id="firstName" name="firstName" type="text" required autoComplete="given-name" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input id="lastName" name="lastName" type="text" required autoComplete="family-name" value={formData.lastName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="companyName" className={labelClass}>Company Name</label>
                    <input id="companyName" name="companyName" type="text" required autoComplete="organization" value={formData.companyName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone</label>
                    <input id="phone" name="phone" type="tel" required autoComplete="tel" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Section 2: Delivery */}
              <section className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <SectionHeader
                  step={2}
                  title="Delivery"
                  subtitle="Where should your fixtures go?"
                  icon={<MapPin className="w-5 h-5" />}
                />
                <div className="space-y-4">
                  <div>
                    <label htmlFor="streetAddress" className={labelClass}>Delivery Address</label>
                    <input id="streetAddress" name="streetAddress" type="text" required autoComplete="street-address" value={formData.streetAddress} onChange={handleInputChange} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="city" className={labelClass}>City</label>
                      <input id="city" name="city" type="text" required autoComplete="address-level2" value={formData.city} onChange={handleInputChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="state" className={labelClass}>State</label>
                      <input id="state" name="state" type="text" required autoComplete="address-level1" value={formData.state} onChange={handleInputChange} className={`${inputClass} uppercase`} />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className={labelClass}>ZIP</label>
                      <input id="zipCode" name="zipCode" type="text" required inputMode="numeric" autoComplete="postal-code" value={formData.zipCode} onChange={handleInputChange} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="targetOpeningDate" className={`${labelClass} flex items-center gap-1.5`}>
                      <Calendar className="w-3.5 h-3.5 text-[#D92323]" />
                      <span>Target Opening Date</span>
                      <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <input id="targetOpeningDate" name="targetOpeningDate" type="date" value={formData.targetOpeningDate} onChange={handleInputChange} className={`${inputClass} sm:max-w-xs`} />
                  </div>

                  <div>
                    <label htmlFor="deliveryNotes" className={labelClass}>
                      Delivery Notes <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Use the rear entrance"
                      className={inputClass}
                    />
                  </div>

                  <fieldset className="pt-3 border-t border-gray-100">
                    <legend className={labelClass}>Does your store have a loading dock?</legend>
                    <div className="flex gap-3">
                      {[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ].map((opt) => (
                        <label
                          key={opt.label}
                          className={`px-5 py-2 rounded-xl border-2 text-sm font-bold cursor-pointer transition-all ${
                            hasLoadingDock === opt.value
                              ? "border-[#D92323] bg-red-50/30 text-gray-950"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasLoadingDock"
                            className="sr-only"
                            checked={hasLoadingDock === opt.value}
                            onChange={() => setHasLoadingDock(opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </section>

              {/* Section 3: Delivery Method */}
              <section className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <SectionHeader
                  step={3}
                  title="Delivery Method"
                  subtitle="Final pricing is confirmed in your quote."
                  icon={<Truck className="w-5 h-5" />}
                />
                <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-1 gap-3">
                  {DELIVERY_OPTIONS.map(renderDeliveryOption)}

                  {showOtherOptions || deliveryMethod === "pickup" ? (
                    renderDeliveryOption(PICKUP_OPTION)
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowOtherOptions(true)}
                      className="self-start inline-flex items-center gap-1 text-xs font-bold text-[#D92323] hover:underline cursor-pointer"
                    >
                      <span>Other delivery options</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* ── RIGHT COLUMN: Project Summary ── */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-md p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-950">Your Store</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {zones.length} Zones · {fixtureCount} Fixtures
                    </p>
                  </div>
                  <Link href="/configurator" className="text-xs font-bold text-[#D92323] hover:underline">
                    Edit in 3D
                  </Link>
                </div>

                {zones.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-6">No fixtures in your layout yet.</p>
                ) : (
                  <ul className="space-y-2.5 text-sm max-h-80 overflow-y-auto pr-1">
                    {zones.map((zone) => (
                      <li key={zone.id} className="flex justify-between gap-4">
                        <span className="text-gray-700 truncate">{zone.name}</span>
                        <span className="font-bold text-gray-950 shrink-0">${zone.total.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-gray-950">Estimated Fixture Total</span>
                  <span className="text-xl sm:text-2xl font-black text-[#D92323]">${fixtureTotal.toLocaleString()}</span>
                </div>

                <p className="mt-3 text-xs text-gray-600">
                  Final freight, installation, applicable taxes, and any project-specific adjustments will be confirmed in your formal quote.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="mt-6 w-full py-4 bg-[#D92323] hover:bg-red-700 disabled:bg-gray-300 text-white font-extrabold text-sm uppercase tracking-wide rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <span>Request Final Quote</span>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-gray-600">No payment required. Your quote arrives by email.</p>
              </div>
            </aside>
          </form>
        )}
      </main>

      <footer className="mt-12 bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} T Shop Fixtures Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Delivery FAQ</span>
            <span className="hover:text-gray-900 cursor-pointer">Warranty</span>
            <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
