"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useCart, CartItem } from "@/components/cart/CartContext";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  UploadCloud,
  DollarSign,
  Printer,
  Download,
  Trash2,
  Info,
  Phone,
  Clock,
  ChevronRight,
  PackageCheck,
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

type FreightTier = "curbside" | "inside" | "turnkey" | "willcall";
type PaymentMethod = "card" | "net30" | "ach" | "lease";

export default function OrderPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    addBundle,
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "Marcus",
    lastName: "Vance",
    businessName: "Metro Retail Group LLC",
    dbaName: "Austin Downtown C-Store & Mart",
    email: "marcus.vance@metroretailgroup.com",
    phone: "(512) 840-2911",
    streetAddress: "4820 South Congress Ave, Building 4",
    city: "Austin",
    state: "TX",
    zipCode: "78745",
    targetOpeningDate: "2026-10-15",
    specialInstructions: "Delivery entrance at rear commercial bay. Please call store manager 45 minutes prior to arrival.",
    hasDock: false,
    needsLiftgate: true,
    semiTruckAccessible: true,
    isTaxExempt: true,
    resaleCertNumber: "TX-94820184-B",
    uploadedFileName: "Store_Blueprint_Floorplan_Rev2.dwg.pdf",
  });

  const [freightTier, setFreightTier] = useState<FreightTier>("curbside");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("net30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber] = useState("TS-84921");

  // Credit Card fields
  const [cardData, setCardData] = useState({
    number: "•••• •••• •••• 4092",
    name: "Marcus Vance",
    expiry: "09/29",
    cvc: "839",
  });

  // Calculate pricing based on items
  const activeItems = items.length > 0 ? items : [];
  const displayItems = activeItems;
  const rawSubtotal = displayItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  // Freight Pricing
  const freightCosts: Record<FreightTier, number> = {
    curbside: 480,
    inside: 980,
    turnkey: 1850,
    willcall: 0,
  };
  const freightAmount = freightCosts[freightTier];

  // ACH 2% cash discount
  const achDiscount = paymentMethod === "ach" ? Math.round(rawSubtotal * 0.02) : 0;

  // Tax calculation (0 if tax-exempt)
  const taxRate = formData.isTaxExempt ? 0 : 0.0825;
  const estimatedTax = Math.round(rawSubtotal * taxRate);

  const totalInvestment = rawSubtotal + freightAmount - achDiscount + estimatedTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const handleLoadPresetBundle = () => {
    addBundle(PRESET_FIXTURES, { open: false });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-gray-900 font-sans flex flex-col">
      {/* ── Focused Commercial Checkout Header ─────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            
            {/* Logo & Navigation */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="hover:opacity-95 transition-opacity">
                <Logo variant="full" height={36} showSubtitle={true} />
              </Link>
              <div className="hidden md:block h-6 w-px bg-gray-200" />
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                <span>Commercial Fixture Order & Freight Logistics</span>
              </div>
            </div>

            {/* Security & Direct Specialist Line */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-800">256-Bit Encrypted B2B Checkout</span>
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

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Layout Manifest</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`flex items-center gap-1.5 ${isOrderPlaced ? "text-emerald-700" : "text-[#D92323]"}`}>
              {isOrderPlaced ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-[#D92323] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
              )}
              <span>2. Delivery Logistics & Payment</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`flex items-center gap-1.5 ${isOrderPlaced ? "text-[#D92323]" : "text-gray-600"}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isOrderPlaced ? "bg-[#D92323] text-white" : "bg-gray-200 text-gray-700"}`}>
                3
              </span>
              <span>3. Order & Freight Confirmation</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Checkout Container ────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Order Confirmed View */}
        {isOrderPlaced ? (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Success Header */}
            <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 text-center relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Commercial Fixture Order Confirmed
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                Thank you! Order <span className="font-mono font-bold text-white">#{orderNumber}</span> has been locked in and routed to our millwork fabrication scheduling team.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 text-xs px-4 py-1.5 rounded-full font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Freight Dispatch: 7–10 Business Days</span>
              </div>
            </div>

            {/* Order Details Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Status Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200/80">
                <div>
                  <div className="text-xs text-gray-600 uppercase font-bold tracking-wider">Purchase Order (PO)</div>
                  <div className="text-base font-extrabold text-gray-950 font-mono mt-0.5">{orderNumber}</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">● Status: Fabrication Scheduled</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 uppercase font-bold tracking-wider">Delivery Site</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{formData.dbaName}</div>
                  <div className="text-xs text-gray-600">{formData.streetAddress}, {formData.city}, {formData.state}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 uppercase font-bold tracking-wider">Assigned Project Engineer</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">David Miller, Sr. Millwork PM</div>
                  <div className="text-xs text-gray-600">Direct: (800) 555-0199 · Ext. 402</div>
                </div>
              </div>

              {/* Delivery Logistics Summary */}
              <div className="border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D92323]" />
                  <span>Freight Logistics Profile</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600 block">Freight Tier</span>
                    <span className="font-bold text-gray-900 capitalize">{freightTier} Delivery</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Hydraulic Liftgate</span>
                    <span className="font-bold text-gray-900">{formData.needsLiftgate ? "Requested & Confirmed" : "Standard Dock"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Target Opening Date</span>
                    <span className="font-bold text-gray-900">{formData.targetOpeningDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Payment Terms</span>
                    <span className="font-bold text-gray-900 uppercase">{paymentMethod === "net30" ? "Net-30 Invoice" : paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Items Manifest */}
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Purchased Store Fixtures ({displayItems.reduce((a, b) => a + b.quantity, 0)} Units)</span>
                  <span className="text-xs text-gray-600 font-normal">All fixtures include 10-Year Heavy Duty Commercial Warranty</span>
                </h3>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {displayItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 relative rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 p-1 flex items-center justify-center">
                          <Image src={item.image} alt={item.title} fill className="object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-950 truncate">{item.title}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">Qty: {item.quantity} · ${item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs sm:text-sm font-extrabold text-gray-950">
                          ${(item.price * item.quantity).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Pre-Drilled & Crated</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Financials Box */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 max-w-sm ml-auto space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Fixtures Subtotal</span>
                  <span className="font-bold text-gray-900">${rawSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Freight Delivery ({freightTier})</span>
                  <span className="font-bold text-gray-900">${freightAmount.toLocaleString()}</span>
                </div>
                {achDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>2% ACH Cash Discount</span>
                    <span>-${achDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Sales Tax {formData.isTaxExempt ? "(Exempt: Resale Cert)" : ""}</span>
                  <span className="font-bold text-gray-900">${estimatedTax.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm sm:text-base font-extrabold text-gray-950">
                  <span>Total Investment</span>
                  <span className="text-[#D92323]">${totalInvestment.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Bill of Materials (BOM)</span>
                  </button>
                  <button
                    onClick={() => alert(`Purchase Order #${orderNumber} downloaded as commercial spec sheet PDF.`)}
                    className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PO</span>
                  </button>
                </div>

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
          /* Main 2-Column Checkout View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: Logistics, Delivery, Site Assessment & Payment (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Notice if cart was empty */}
              {displayItems.length === 0 && (
                <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Your store layout cart has no active fixtures.</h4>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Would you like to load the recommended 7-fixture store layout package ($15,722)?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLoadPresetBundle}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                  >
                    Load 7 Fixtures ($15,722)
                  </button>
                </div>
              )}

              {/* Section 1: Business & Commercial Account Details */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D92323] flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-950">Commercial Account & Contact</h2>
                      <p className="text-xs text-gray-600">Receiving manager & business entity details for commercial freight dispatch</p>
                    </div>
                  </div>
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Legal Business / Entity Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Store DBA / Project Label</label>
                    <input
                      type="text"
                      name="dbaName"
                      value={formData.dbaName}
                      onChange={handleInputChange}
                      placeholder="e.g. Austin Downtown Flagship"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Work Email (for Invoices & CAD)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Direct Receiving Phone Number (Driver Contact)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>
                </div>

                {/* Resale Certificate / Tax Exemption */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="taxExempt"
                        checked={formData.isTaxExempt}
                        onChange={() => handleCheckboxChange("isTaxExempt")}
                        className="w-4 h-4 text-[#D92323] rounded-sm focus:ring-[#D92323] cursor-pointer"
                      />
                      <label htmlFor="taxExempt" className="text-xs font-bold text-gray-900 cursor-pointer">
                        Tax-Exempt Commercial Entity / Wholesale Resale Certificate
                      </label>
                    </div>
                    {formData.isTaxExempt && (
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Tax Waived ($0.00)
                      </span>
                    )}
                  </div>
                  {formData.isTaxExempt && (
                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">State Resale Cert / EIN Number</label>
                        <input
                          type="text"
                          name="resaleCertNumber"
                          value={formData.resaleCertNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. TX-94820184-B"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 bg-white"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 flex items-center">
                        Tax will be removed upon commercial resale validation at millwork dispatch.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Store Delivery Address & Site Logistics Readiness */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D92323] flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-950">Store Delivery Site & Logistics Readiness</h2>
                      <p className="text-xs text-gray-600">Ensure semi-truck accessibility, dock heights, and offload equipment</p>
                    </div>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Commercial Delivery Street Address</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Target Opening Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D92323]" />
                        <span>Target Store Opening Date</span>
                      </label>
                      <input
                        type="date"
                        name="targetOpeningDate"
                        value={formData.targetOpeningDate}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900"
                      />
                    </div>
                    <div className="flex flex-col justify-center text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900">Guaranteed Production Buffer:</span>
                      <span>Fixtures will arrive 10-14 days prior to opening for merchandising.</span>
                    </div>
                  </div>

                  {/* Site Readiness Assessment Checklist */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2.5">
                      Site Accessibility Checklist
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasDock}
                          onChange={() => handleCheckboxChange("hasDock")}
                          className="mt-0.5 w-4 h-4 text-[#D92323] rounded-sm focus:ring-[#D92323]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Loading Dock (48″)</span>
                          <span className="text-gray-600">Standard elevated bay</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.needsLiftgate}
                          onChange={() => handleCheckboxChange("needsLiftgate")}
                          className="mt-0.5 w-4 h-4 text-[#D92323] rounded-sm focus:ring-[#D92323]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Hydraulic Liftgate</span>
                          <span className="text-gray-600">Required if ground-level</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.semiTruckAccessible}
                          onChange={() => handleCheckboxChange("semiTruckAccessible")}
                          className="mt-0.5 w-4 h-4 text-[#D92323] rounded-sm focus:ring-[#D92323]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">Semi-Truck Access</span>
                          <span className="text-gray-600">53-ft trailer clearance</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Special Logistics Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">Special Receiving & Dock Instructions</label>
                    <textarea
                      rows={2}
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D92323]/30 focus:border-[#D92323]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Selectable Freight & Installation Tier */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D92323] flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-950">Freight Delivery & Installation Tier</h2>
                      <p className="text-xs text-gray-600">Heavy commercial fixtures are shipped securely in custom timber crates</p>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-gray-600" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Curbside Freight */}
                  <div
                    onClick={() => setFreightTier("curbside")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      freightTier === "curbside"
                        ? "border-[#D92323] bg-red-50/20 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        freightTier === "curbside" ? "border-[#D92323] bg-[#D92323]" : "border-gray-400"
                      }`}>
                        {freightTier === "curbside" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-950">Curbside LTL Freight with Liftgate</span>
                          <span className="text-[10px] uppercase font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Standard Commercial</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Delivery to dock or ground level via hydraulic liftgate. Scheduled appointment call-ahead included.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-gray-950">$480</span>
                      <span className="text-[10px] text-gray-600 block">Flat Commercial</span>
                    </div>
                  </div>

                  {/* Inside White Glove */}
                  <div
                    onClick={() => setFreightTier("inside")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      freightTier === "inside"
                        ? "border-[#D92323] bg-red-50/20 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        freightTier === "inside" ? "border-[#D92323] bg-[#D92323]" : "border-gray-400"
                      }`}>
                        {freightTier === "inside" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-950">White-Glove Inside Delivery & De-Trashing</span>
                          <span className="text-[10px] uppercase font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Popular</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Crates carried through ground entrance into your retail floor. Pallets unbanded and wood debris removed.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-gray-950">$980</span>
                      <span className="text-[10px] text-gray-600 block">Turnkey Handling</span>
                    </div>
                  </div>

                  {/* Turnkey On-Site Assembly */}
                  <div
                    onClick={() => setFreightTier("turnkey")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      freightTier === "turnkey"
                        ? "border-[#D92323] bg-red-50/20 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        freightTier === "turnkey" ? "border-[#D92323] bg-[#D92323]" : "border-gray-400"
                      }`}>
                        {freightTier === "turnkey" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-950">Turnkey Millwork Assembly & Fixture Leveling</span>
                          <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Complete Setup</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Certified millwork installation team arrives on-site. Gondolas anchored, checkout counters leveled and wired.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-gray-950">$1,850</span>
                      <span className="text-[10px] text-gray-600 block">Full Assembly</span>
                    </div>
                  </div>

                  {/* Will-Call Terminal Pickup */}
                  <div
                    onClick={() => setFreightTier("willcall")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      freightTier === "willcall"
                        ? "border-[#D92323] bg-red-50/20 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        freightTier === "willcall" ? "border-[#D92323] bg-[#D92323]" : "border-gray-400"
                      }`}>
                        {freightTier === "willcall" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-950">Freight Terminal Will-Call Pickup</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Pickup from regional distribution hubs (Dallas, TX / Chicago, IL / Atlanta, GA).
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-emerald-600">FREE</span>
                      <span className="text-[10px] text-gray-600 block">$0 Terminal Fee</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 4: Architectural Blueprint / CAD Plan Upload */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#D92323]" />
                    <h3 className="text-sm font-extrabold text-gray-950">Store Blueprint / Architectural CAD Upload</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Optional</span>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Upload your store floor plan (PDF, DWG, DXF, PNG). Our senior spatial engineers will verify fixture clearances before millwork cutting.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center bg-gray-50/70 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#D92323] flex items-center justify-center mx-auto mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  {formData.uploadedFileName ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{formData.uploadedFileName}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, uploadedFileName: "" }))}
                        className="text-gray-400 hover:text-red-600 ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-gray-800">Drag and drop CAD or floor plan here, or browse files</p>
                      <p className="text-[11px] text-gray-600 mt-1">Supports PDF, DWG, DXF, PNG up to 50MB</p>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, uploadedFileName: "Austin_Retail_Floorplan_2026.pdf" }))}
                        className="mt-3 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Select Architectural File
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Commercial Payment & Financing Method */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D92323] flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-950">Commercial Payment & Financing Terms</h2>
                      <p className="text-xs text-gray-600">Select business trade credit, credit card, ACH, or equipment lease</p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("net30")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "net30"
                        ? "border-[#D92323] bg-red-50/30 text-gray-950 font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-xs font-bold">Net-30 Terms</span>
                    <span className="text-[10px] text-[#D92323] font-bold">Trade Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ach")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "ach"
                        ? "border-[#D92323] bg-red-50/30 text-gray-950 font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-xs font-bold">ACH / Wire</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Save 2% Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-[#D92323] bg-red-50/30 text-gray-950 font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-xs font-bold">Credit Card</span>
                    <span className="text-[10px] text-gray-600">Visa, MC, Amex</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("lease")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "lease"
                        ? "border-[#D92323] bg-red-50/30 text-gray-950 font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-xs font-bold">Lease-to-Own</span>
                    <span className="text-[10px] text-purple-700 font-bold">From $465/mo</span>
                  </button>
                </div>

                {/* Tab 1: Net-30 Trade Credit Terms */}
                {paymentMethod === "net30" && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#D92323]" />
                        <span className="text-xs font-bold text-gray-900">Commercial Net-30 Trade Credit</span>
                      </div>
                      <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Instant Trade Approval
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Payment is due 30 days following freight delivery. Commercial invoice will be issued directly to <span className="font-semibold text-gray-900">{formData.email}</span>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Company D&B D-U-N-S® or EIN</label>
                        <input
                          type="text"
                          defaultValue="84-920-1928"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Accounts Payable Contact Name</label>
                        <input
                          type="text"
                          defaultValue="Finance Department"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: ACH Bank Wire Discount */}
                {paymentMethod === "ach" && (
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>2% Commercial Cash Discount Applied</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700">
                        Saves ${achDiscount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Bank routing details and domestic wire instructions will be generated upon order placement with guaranteed price lock.
                    </p>
                  </div>
                )}

                {/* Tab 3: Credit Card Details */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData((p) => ({ ...p, number: e.target.value }))}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm bg-white font-mono"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1">
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">VISA</span>
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">MC</span>
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">AMEX</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-800 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Expiry / CVC</label>
                        <input
                          type="text"
                          value={`${cardData.expiry} · ${cardData.cvc}`}
                          onChange={(e) => setCardData((p) => ({ ...p, expiry: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Equipment Leasing */}
                {paymentMethod === "lease" && (
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950">Commercial Equipment Lease-to-Own</span>
                      <span className="text-xs font-extrabold text-purple-700">$465 / Month · 36 Months</span>
                    </div>
                    <p className="text-xs text-purple-900/80">
                      $0 Down Commercial Fixture Financing with 100% Section 179 first-year tax deduction eligibility.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT COLUMN: Sticky Order Manifest & Financial Summary (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Order Manifest Card */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-md p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-[#D92323]" />
                    <h3 className="text-base font-extrabold text-gray-950">
                      Store Layout Manifest ({displayItems.reduce((a, b) => a + b.quantity, 0)})
                    </h3>
                  </div>
                  <Link
                    href="/configurator"
                    className="text-xs font-bold text-[#D92323] hover:underline"
                  >
                    Edit in 3D
                  </Link>
                </div>

                {/* Fixture Items List */}
                <div className="max-h-80 overflow-y-auto space-y-3.5 divide-y divide-gray-100 pr-1">
                  {displayItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-gray-600">No items currently in manifest.</p>
                      <button
                        type="button"
                        onClick={handleLoadPresetBundle}
                        className="mt-3 px-3.5 py-1.5 bg-[#D92323] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-red-700"
                      >
                        Load 7-Fixture Package ($15,722)
                      </button>
                    </div>
                  ) : (
                    displayItems.map((item) => (
                      <div key={item.id} className="pt-3.5 first:pt-0 flex gap-3 items-center">
                        <div className="w-14 h-14 relative rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                          <Image src={item.image} alt={item.title} fill className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-950 truncate">{item.title}</h4>
                          <div className="text-xs font-extrabold text-[#D92323] mt-0.5">
                            ${(item.price * item.quantity).toLocaleString()}{" "}
                            <span className="text-[11px] font-normal text-gray-600">
                              (${item.price.toLocaleString()} ea)
                            </span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center border border-gray-200 rounded-md text-[11px] bg-gray-50">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-gray-900">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotals & Fees */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Fixtures Hardware Subtotal</span>
                    <span className="font-extrabold text-gray-950 text-sm">${rawSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-gray-700">
                      <span>3D Store Layout Consultation</span>
                      <span className="text-[10px] text-gray-600 line-through">$500</span>
                    </span>
                    <span className="text-emerald-600 font-extrabold">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Heavy-Duty Timber Pallet Packaging</span>
                    <span className="text-emerald-600 font-extrabold">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium capitalize">Freight Delivery ({freightTier})</span>
                    <span className="font-bold text-gray-950">
                      {freightAmount === 0 ? "FREE" : `$${freightAmount.toLocaleString()}`}
                    </span>
                  </div>

                  {achDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>2% ACH Cash Discount</span>
                      <span>-${achDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>
                      Estimated Sales Tax {formData.isTaxExempt && "(Resale Exempt)"}
                    </span>
                    <span className="font-bold text-gray-950">
                      {formData.isTaxExempt ? "$0.00" : `$${estimatedTax.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-extrabold text-gray-950 block">Total Investment</span>
                      <span className="text-[11px] text-gray-600">Guaranteed pricing locked for 30 days</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#D92323]">
                      ${totalInvestment.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Submit Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || displayItems.length === 0}
                  className="mt-6 w-full py-4 bg-[#D92323] hover:bg-red-700 disabled:bg-gray-300 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Locking In Production & Freight...</span>
                    </div>
                  ) : (
                    <span>Submit Commercial Order & Schedule Delivery</span>
                  )}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>10-Year Heavy Duty Commercial Millwork Warranty Included</span>
                </div>
              </div>

              {/* Dedicated Project Manager Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-3.5 shadow-xs">
                <div className="w-11 h-11 rounded-full bg-red-50 text-[#D92323] border border-red-100 flex items-center justify-center font-bold shrink-0 text-sm">
                  DM
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-950">David Miller — Senior Retail Project Engineer</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Assigned to oversee your layout fabrication, millwork tolerances, and delivery dispatch.
                  </p>
                  <a
                    href="tel:8005550199"
                    className="text-[11px] text-[#D92323] font-bold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <span>Direct: (800) 555-0199 · Ext. 402</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="mt-12 bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} T Shop Fixtures Inc. All Rights Reserved. Commercial Retail Systems.</p>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Freight Terms</span>
            <span className="hover:text-gray-900 cursor-pointer">Warranty Certificate</span>
            <span className="hover:text-gray-900 cursor-pointer">Privacy & B2B Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
