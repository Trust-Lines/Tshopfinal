"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Store,
  ShoppingCart,
  Truck,
  Layers,
  Coffee,
  UtensilsCrossed,
  CreditCard,
  Archive,
  Check,
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Info,
  Edit3,
  RotateCw,
  Box,
  Tag,
  Users,
  CheckCircle2,
  X,
  Mail,
  FileText,
  Boxes,
  Hand,
  PanelRightClose,
  PanelRightOpen,
  ZoomIn,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import type { SceneView } from "./StoreScene";
import {
  STORE_TYPES,
  ZONES,
  ZoneDef,
  StoreType,
  variantIdForHeight,
} from "./config";

// Dynamic 3D Scene Loader
const StoreScene = dynamic(() => import("./StoreScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3">
      <RotateCw className="w-8 h-8 animate-spin text-[#D92C32]" />
      <span className="text-sm font-medium">Loading 3D Visualizer…</span>
    </div>
  ),
});

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

interface ConfiguredZoneData {
  length: number;
  height: string;
  depth: string;
  price: number;
  fixtures: number;
  swapOption?: "Standard" | "Premium" | "Value";
}

export default function ConfiguratorFlow() {
  const { addBundle } = useCart();

  // Step state: 1 = Choose Your Store, 2 = Configure Selected Zones, 3 = Review Your Store
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Desktop panel visibility
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  // Step 1: Store selection & multi-zone selection
  const [selectedStoreId, setSelectedStoreId] = useState<string>("cstore");
  // Default to 3 zones matching mockup
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([
    "deli",
    "front-checkout",
    "back-counter",
  ]);

  // Step 2: Sequential configuration index
  const [activeZoneIdx, setActiveZoneIdx] = useState<number>(0);

  // Form values for the currently active zone in Step 2
  const [formLength, setFormLength] = useState<number>(14);
  const [formHeight, setFormHeight] = useState<string>("36″ Standard");
  const [formDepth, setFormDepth] = useState<string>("24″ Standard");
  const [isRangeExceeded, setIsRangeExceeded] = useState<boolean>(false);

  // Stored configuration for each zone
  const [configuredZones, setConfiguredZones] = useState<
    Record<string, ConfiguredZoneData>
  >({
    gondola: {
      length: 14,
      height: "54″ Standard",
      depth: "24″ Standard",
      price: 3120,
      fixtures: 5,
      swapOption: "Standard",
    },
    deli: {
      length: 14,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2858,
      fixtures: 4,
      swapOption: "Standard",
    },
    coffee: {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2240,
      fixtures: 4,
      swapOption: "Standard",
    },
    "front-checkout": {
      length: 12,
      height: "36″ Standard",
      depth: "30″ Standard",
      price: 2640,
      fixtures: 4,
      swapOption: "Standard",
    },
    "back-counter": {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 1572,
      fixtures: 3,
      swapOption: "Standard",
    },
  });

  // Step 3: Camera view and swap simulator
  const [view, setView] = useState<SceneView>("3q");
  const [activeSwapZoneId, setActiveSwapZoneId] = useState<string>("deli");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);

  // Active store object
  const currentStore = useMemo(() => {
    return (
      STORE_TYPES.find((s) => s.id === selectedStoreId) ?? STORE_TYPES[0]
    );
  }, [selectedStoreId]);

  // Active zone object in Step 2
  const currentActiveZone = useMemo(() => {
    const currentId = selectedZoneIds[activeZoneIdx] || selectedZoneIds[0] || "deli";
    return ZONES.find((z) => z.id === currentId) ?? ZONES[0];
  }, [selectedZoneIds, activeZoneIdx]);

  // Live estimate for the zone currently being edited (Step 2)
  const currentZoneEstimate = useMemo(() => {
    if (!currentActiveZone) return 0;
    const len = Number(formLength);
    if (isNaN(len) || len <= 0) return 0;
    return Math.round((currentActiveZone.basePrice * len) / currentActiveZone.refLen);
  }, [currentActiveZone, formLength]);

  // Sync form inputs when active zone changes in Step 2
  const loadZoneConfig = (zoneId: string) => {
    const zDef = ZONES.find((z) => z.id === zoneId);
    if (!zDef) return;
    const existing = configuredZones[zoneId];
    if (existing) {
      setFormLength(existing.length);
      setFormHeight(existing.height);
      setFormDepth(existing.depth);
      setIsRangeExceeded(existing.length < 4 || existing.length > 40);
    } else {
      setFormLength(zDef.refLen);
      setFormHeight(zDef.heightOptions[0]);
      setFormDepth(zDef.depthOptions[0]);
      setIsRangeExceeded(false);
    }
  };

  // Toggle zone in Step 1
  const toggleZone = (id: string) => {
    setSelectedZoneIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least 1
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Move from Step 1 to Step 2
  const handleStartConfiguring = () => {
    if (selectedZoneIds.length === 0) return;
    setActiveZoneIdx(0);
    loadZoneConfig(selectedZoneIds[0]);
    setStep(2);
  };

  // Save current zone and advance to next zone or Step 3
  const handleSaveAndContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentActiveZone) return;

    const len = Number(formLength);
    if (isNaN(len) || len <= 0) return;

    const ratio = len / currentActiveZone.refLen;
    const calculatedPrice = Math.round(currentActiveZone.basePrice * ratio);
    const calculatedFixtures = Math.max(
      1,
      Math.round(currentActiveZone.fixtures * ratio)
    );

    const updatedConfig: ConfiguredZoneData = {
      length: len,
      height: formHeight,
      depth: formDepth,
      price: calculatedPrice,
      fixtures: calculatedFixtures,
      swapOption: configuredZones[currentActiveZone.id]?.swapOption || "Standard",
    };

    setConfiguredZones((prev) => ({
      ...prev,
      [currentActiveZone.id]: updatedConfig,
    }));

    if (activeZoneIdx < selectedZoneIds.length - 1) {
      const nextIdx = activeZoneIdx + 1;
      setActiveZoneIdx(nextIdx);
      loadZoneConfig(selectedZoneIds[nextIdx]);
    } else {
      setStep(3);
    }
  };

  // Go back from Step 2
  const handleStep2Back = () => {
    if (activeZoneIdx > 0) {
      const prevIdx = activeZoneIdx - 1;
      setActiveZoneIdx(prevIdx);
      loadZoneConfig(selectedZoneIds[prevIdx]);
    } else {
      setStep(1);
    }
  };

  // Swap unit simulator in Step 3
  const handleSwapChoice = (zoneId: string, choice: "Standard" | "Premium" | "Value") => {
    setConfiguredZones((prev) => {
      const zoneData = prev[zoneId];
      if (!zoneData) return prev;
      const zDef = ZONES.find((z) => z.id === zoneId);
      const baseLen = zoneData.length;
      const baseRatio = baseLen / (zDef?.refLen || 20);
      let newPrice = Math.round((zDef?.basePrice || 3000) * baseRatio);

      if (choice === "Premium") newPrice += 90 * (zoneData.fixtures || 4);
      if (choice === "Value") newPrice -= 40 * (zoneData.fixtures || 4);

      return {
        ...prev,
        [zoneId]: {
          ...zoneData,
          price: Math.max(100, newPrice),
          swapOption: choice,
        },
      };
    });
  };

  // Aggregated totals
  const totalFixtures = useMemo(() => {
    return selectedZoneIds.reduce((sum, id) => {
      const entry = configuredZones[id];
      const zDef = ZONES.find((z) => z.id === id);
      return sum + (entry ? entry.fixtures : zDef?.fixtures || 3);
    }, 0);
  }, [selectedZoneIds, configuredZones]);

  const totalPrice = useMemo(() => {
    return selectedZoneIds.reduce((sum, id) => {
      const entry = configuredZones[id];
      const zDef = ZONES.find((z) => z.id === id);
      return sum + (entry ? entry.price : zDef?.basePrice || 2000);
    }, 0);
  }, [selectedZoneIds, configuredZones]);

  // Rows for 3D visualizer
  const sceneRows = useMemo(() => {
    const idsToRender =
      step === 2
        ? selectedZoneIds.slice(0, activeZoneIdx + 1)
        : selectedZoneIds;

    return idsToRender.map((id) => {
      const zDef = ZONES.find((z) => z.id === id) || ZONES[0];
      const conf = configuredZones[id];
      const lengthFt = conf ? conf.length : zDef.refLen;
      const heightIn = conf
        ? parseInt(conf.height) || zDef.heights[0]
        : zDef.heights[0];

      return {
        zone: zDef,
        sel: {
          lengthFt,
          finish: "natural_oak" as const,
          variantId: variantIdForHeight(heightIn),
        },
        bays: conf ? conf.fixtures : zDef.fixtures,
      };
    });
  }, [step, selectedZoneIds, activeZoneIdx, configuredZones]);

  // Add configured store to cart
  const handleAddToCart = () => {
    const cartItems = selectedZoneIds.map((id, index) => {
      const zDef = ZONES.find((z) => z.id === id)!;
      const conf = configuredZones[id];
      const len = conf ? conf.length : zDef.refLen;
      const h = conf ? conf.height : zDef.heightOptions[0];
      const price = conf ? conf.price : zDef.basePrice;
      const fixtures = conf ? conf.fixtures : zDef.fixtures;

      return {
        id: `cfg-${currentStore.id}-${id}-${Date.now()}-${index}`,
        title: `${zDef.label} (${currentStore.name}) — ${len}'L · ${fixtures} fixtures · ${h}`,
        price: Math.round(price),
        image: zDef.cartImage,
        quantity: 1,
      };
    });

    addBundle(cartItems, { open: true });
  };

  const getStoreIcon = (id: string, cls = "w-4 h-4") => {
    switch (id) {
      case "cstore":
        return <Store className={cls} />;
      case "grocery":
        return <ShoppingCart className={cls} />;
      case "truck":
        return <Truck className={cls} />;
      default:
        return <Store className={cls} />;
    }
  };

  const getZoneIcon = (id: string, cls = "w-5 h-5") => {
    switch (id) {
      case "gondola":
        return <Layers className={cls} />;
      case "deli":
        return <UtensilsCrossed className={cls} />;
      case "coffee":
        return <Coffee className={cls} />;
      case "front-checkout":
        return <CreditCard className={cls} />;
      case "back-counter":
        return <Archive className={cls} />;
      default:
        return <Layers className={cls} />;
    }
  };

  const stepTitles: Record<number, { title: string; sub: string }> = {
    1: {
      title: "Choose Your Store",
      sub: "Start by selecting a store type and the zones you want to include.",
    },
    2: {
      title: "Configure Zones",
      sub: "Set the dimensions and options for each zone right in your store layout.",
    },
    3: {
      title: "Review Your Store",
      sub: "Take a final look at your store, make changes, and get a quote or add to cart.",
    },
  };

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[#faf9f7] text-gray-900 font-sans">
      
      {/* ════════════════════════════════════════════════════════════
          LEFT STAGE: SUB-HEADER & 3D CANVAS (Fills left & center)
         ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        {/* SUB-HEADER: Breadcrumbs & Step Indicator (Matching Mockup) */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 py-2.5 sm:py-3 z-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-1 sm:gap-1.5">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              <span>PLAN</span>
              <span className="text-gray-300">/</span>
              <span className="text-[#D92C32]">CONFIGURE</span>
              <span className="text-gray-300">/</span>
              <span>OUTFIT</span>
              <span className="text-gray-300">/</span>
              <span>GROW</span>
            </div>

            {/* Title and Stepper Circles row */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight leading-tight truncate">
                  {stepTitles[step].title}
                </h1>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate leading-snug mt-0.5">
                  {stepTitles[step].sub}
                </p>
              </div>

              {/* Stepper circles: (1) (2) (3) with green checks when done */}
              <div className="flex items-center gap-1.5 shrink-0">
                {([1, 2, 3] as const).map((n) => {
                  const isCurrent = step === n;
                  const isPassed = step > n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        if (isPassed || (n === 2 && selectedZoneIds.length > 0)) {
                          setStep(n);
                        }
                      }}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-[#D92C32] text-white shadow-sm"
                          : isPassed
                          ? "bg-emerald-600 text-white cursor-pointer"
                          : "bg-gray-200 text-gray-600 cursor-default"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        n
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3D VIEWPORT CONTAINER */}
        <div className="relative w-full h-[36vh] sm:h-[40vh] lg:h-auto lg:flex-1 shrink-0 overflow-hidden bg-[#f4f3f0]">
          <StoreScene rows={sceneRows} view={step === 3 ? view : "3q"} />

          {/* Step 1 Overlay: "3D View" badge top-right */}
          {step === 1 && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-sm pointer-events-none">
                <Boxes className="w-3.5 h-3.5 text-[#D92C32]" />
                <span>3D View</span>
              </div>
            </div>
          )}

          {/* Step 2 Overlay: "Tap & drag to rotate" badge bottom-center */}
          {step === 2 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-800 border border-gray-200 shadow-md pointer-events-none">
                <span className="text-sm leading-none">👆</span>
                <span>Tap &amp; drag to rotate</span>
              </div>
            </div>
          )}

          {/* Step 3 Overlay: Camera views pills bottom-center */}
          {step === 3 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md">
                {(["front", "3q", "top"] as SceneView[]).map((v) => {
                  const isSel = view === v;
                  const label = v === "front" ? "Front" : v === "3q" ? "Angle" : "Top";
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSel
                          ? "bg-[#D92C32] text-white shadow-sm"
                          : "text-gray-700 hover:text-gray-950 font-medium"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          CONFIGURATION PANEL:
          - On mobile (<lg): Bottom sheet occupying lower screen
          - On desktop (lg+): FULL RIGHT SIDEBAR (docked full height, 0 margin)
         ════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-20 flex-1 lg:flex-none flex flex-col bg-white
          rounded-t-[28px] sm:rounded-t-[32px] lg:rounded-none
          lg:w-[460px] xl:w-[500px] 2xl:w-[540px] lg:h-full
          shadow-[0_-8px_32px_rgba(0,0,0,0.09)] lg:shadow-xl
          border-t lg:border-t-0 lg:border-l border-gray-200
          overflow-hidden shrink-0"
      >
        {/* Grab Handle for Mobile */}
        <div className="lg:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1.5 shrink-0 cursor-pointer" />

        {/* ── STEP 1: CHOOSE YOUR STORE ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
              {/* 1 Store Type */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D92C32] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    1
                  </span>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Store Type
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STORE_TYPES.map((st) => {
                    const isSelected = selectedStoreId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStoreId(st.id)}
                        className={`py-2.5 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-[#D92C32] text-white border-transparent shadow-sm"
                            : "bg-white border-gray-200 text-gray-800 hover:border-gray-300"
                        }`}
                      >
                        {getStoreIcon(st.id, "w-3.5 h-3.5 shrink-0")}
                        <span>{st.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2 Select Zones */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D92C32] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    2
                  </span>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Select Zones{" "}
                    <span className="text-gray-500 font-normal lowercase tracking-normal">
                      ({selectedZoneIds.length} selected)
                    </span>
                  </h2>
                </div>

                <div className="space-y-2">
                  {ZONES.map((zone) => {
                    const isSelected = selectedZoneIds.includes(zone.id);
                    return (
                      <div
                        key={zone.id}
                        onClick={() => toggleZone(zone.id)}
                        className={`w-full p-2 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                          isSelected
                            ? "border-gray-200 bg-white"
                            : "border-gray-100 bg-gray-50/50 hover:bg-gray-50"
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <img
                          src={zone.cartImage}
                          alt={zone.label}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200/80 p-0.5 shrink-0"
                        />

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-950 truncate leading-tight">
                            {zone.label}
                          </h3>
                          <p className="text-[10.5px] text-gray-500 truncate leading-tight mt-0.5">
                            {zone.tagline}
                          </p>
                        </div>

                        {/* Red Checkbox on the right */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? "bg-[#D92C32] text-white"
                              : "border-2 border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Bottom CTA */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
              <button
                type="button"
                onClick={handleStartConfiguring}
                disabled={selectedZoneIds.length === 0}
                className="w-full py-3 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>
                  Configure {selectedZoneIds.length} Zone
                  {selectedZoneIds.length !== 1 ? "s" : ""}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-2 font-medium">
                You can add or remove zones later.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: CONFIGURE ZONES ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Header row: (2) Configure Zones, badge, close button */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D92C32] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  2
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-gray-950">
                  Configure Zones
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#D92C32] bg-red-50 px-2.5 py-0.5 rounded-full">
                  {activeZoneIdx + 1} / {selectedZoneIds.length}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3.5">
              {/* Active Zone Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50/40 border border-red-100">
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#D92C32] flex items-center justify-center shrink-0">
                  {getZoneIcon(currentActiveZone.id, "w-5 h-5")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-950 truncate leading-tight">
                    {currentActiveZone.label}
                  </h3>
                  <p className="text-[10.5px] text-gray-500 truncate leading-tight mt-0.5">
                    {currentActiveZone.tagline}
                  </p>
                </div>
              </div>

              {/* Horizontal Zone Navigation Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {selectedZoneIds.map((id, idx) => {
                  const z = ZONES.find((item) => item.id === id);
                  const isCurrent = idx === activeZoneIdx;
                  const isCompleted = idx < activeZoneIdx || !!configuredZones[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveZoneIdx(idx);
                        loadZoneConfig(id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#D92C32] text-white shadow-sm"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>{z?.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSaveAndContinue} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Length (ft)
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={formLength}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormLength(val);
                      setIsRangeExceeded(val < 4 || val > 40);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-900 text-sm outline-none focus:border-[#D92C32] focus:ring-1 focus:ring-[#D92C32] transition-all bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Height
                    </label>
                    <div className="relative">
                      <select
                        value={formHeight}
                        onChange={(e) => setFormHeight(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-300 font-medium text-gray-900 text-xs sm:text-sm outline-none focus:border-[#D92C32] bg-white transition-all"
                      >
                        {currentActiveZone.heightOptions.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Depth
                    </label>
                    <div className="relative">
                      <select
                        value={formDepth}
                        onChange={(e) => setFormDepth(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-300 font-medium text-gray-900 text-xs sm:text-sm outline-none focus:border-[#D92C32] bg-white transition-all"
                      >
                        {currentActiveZone.depthOptions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {isRangeExceeded && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-tight">
                    <b>Outside standard range (4–40 ft):</b> Custom milling available upon request.
                  </div>
                )}

                {/* Zone Estimate Row */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-500 font-medium">
                    Zone estimate
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#D92C32]">
                    {money(currentZoneEstimate)}
                  </span>
                </div>
              </form>
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleStep2Back}
                className="w-12 h-11 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer shrink-0"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleSaveAndContinue()}
                className="flex-1 h-11 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>
                  {activeZoneIdx < selectedZoneIds.length - 1
                    ? "Next Zone"
                    : "Review Store"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: REVIEW YOUR STORE ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Header: Store Summary & Edit Store button */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-gray-100 shrink-0">
              <h2 className="text-sm font-bold text-gray-950">
                Store Summary
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                }}
                className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-[#D92C32]" />
                <span>Edit Store</span>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-4">
              {/* 3 KPI Stat Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <Users className="w-4 h-4 text-gray-500 mx-auto mb-0.5" />
                  <span className="text-base font-black text-gray-950 block leading-tight">
                    {selectedZoneIds.length}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Zones</span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <Box className="w-4 h-4 text-gray-500 mx-auto mb-0.5" />
                  <span className="text-base font-black text-gray-950 block leading-tight">
                    {totalFixtures}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Fixtures</span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <Tag className="w-4 h-4 text-gray-500 mx-auto mb-0.5" />
                  <span className="text-sm sm:text-base font-black text-gray-950 block leading-tight">
                    {money(totalPrice)}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Estimated Total</span>
                </div>
              </div>

              {/* Your Zones List */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">
                  Your Zones ({selectedZoneIds.length})
                </h3>
                <div className="space-y-2">
                  {selectedZoneIds.map((id, index) => {
                    const z = ZONES.find((item) => item.id === id)!;
                    const conf = configuredZones[id];
                    const len = conf?.length || z.refLen;
                    const h = (conf?.height || z.heightOptions[0]).replace(" Standard", "");
                    const d = (conf?.depth || z.depthOptions[0]).replace(" Standard", "");
                    const price = conf?.price || z.basePrice;

                    return (
                      <div
                        key={id}
                        className="p-2 rounded-xl border border-gray-200 bg-white flex items-center gap-3"
                      >
                        {/* Thumbnail */}
                        <img
                          src={z.cartImage}
                          alt={z.label}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200/80 p-0.5 shrink-0"
                        />

                        {/* Middle info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-950 truncate leading-tight">
                            {z.label}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                            {len}&apos;L × {h}&quot;H × {d}&quot;D
                          </p>
                        </div>

                        {/* Right: price and Edit button */}
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-gray-950 block">
                            {money(price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveZoneIdx(index);
                              loadZoneConfig(id);
                              setStep(2);
                            }}
                            className="text-[11px] font-bold text-[#D92C32] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Dual CTAs */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D92C32]" />
                  <span>Get a Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center font-normal">
                Pricing is an estimate. Final pricing may vary based on configuration.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════
          QUOTE MODAL
         ════════════════════════════════════════════════════════════ */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-950">
                Request Store Quotation
              </h3>
              <button
                type="button"
                onClick={() => {
                  setQuoteModalOpen(false);
                  setQuoteSent(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSent ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-gray-950">Quotation Sent!</h4>
                <p className="text-xs text-gray-600">
                  We sent the proposal for your {currentStore.name} ({money(totalPrice)}) to{" "}
                  <b>{quoteEmail}</b>. A retail fixture specialist will follow up shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteModalOpen(false);
                    setQuoteSent(false);
                  }}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#D92C32] text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Get an itemized specification sheet, CAD elevations, and custom pricing package for your{" "}
                  <b>{currentStore.name}</b> ({selectedZoneIds.length} zones, {totalFixtures} fixtures, {money(totalPrice)}).
                </p>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Your Business Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="store-owner@example.com"
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#D92C32]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (quoteEmail) setQuoteSent(true);
                  }}
                  disabled={!quoteEmail}
                  className="w-full py-3 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white font-bold text-sm transition-all disabled:opacity-40 cursor-pointer shadow-md"
                >
                  Send Quotation Package
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}