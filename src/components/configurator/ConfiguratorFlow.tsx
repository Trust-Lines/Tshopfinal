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
  ArrowLeft,
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
  Sparkles,
  DoorClosed,
  Trash2,
  Pencil,
  Search,
  User,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import type { SceneView } from "./StoreScene";
import StoreLayoutPreview from "./StoreLayoutPreview";
import {
  STORE_TYPES,
  ZONES,
  ZoneDef,
  StoreType,
  variantIdForHeight,
  ZONE_STANDARDS,
  SlotStandard,
  ZONE_MODEL_OPTIONS,
  ModelOption,
} from "./config";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

interface ConfiguredZoneData {
  length: number;
  height: string;
  depth: string;
  price: number;
  fixtures: number;
  swapOption?: "Standard" | "Premium" | "Value";
  selectedModelId?: string;
  selectedModelFile?: string;
  stepM?: number;
}

export default function ConfiguratorFlow() {
  const { addBundle, count } = useCart();

  // Step state: 
  // 1 = Select store type (Images 1 & 2)
  // 1.5 = Select zones for store type (Image 3)
  // 2 = 3D Configurator Workspace (Images 4 & 5)
  // 3 = Review & Finish summary
  const [step, setStep] = useState<1 | 1.5 | 2 | 3>(1);

  // Store selection
  const [selectedStoreId, setSelectedStoreId] = useState<string>("cstore");

  // Zone selections for the store (Gondola Shelving, Deli Counter, Coffee Counter, Front Checkout, Back Counter)
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([
    "gondola",
    "deli",
    "coffee",
    "front-checkout",
    "back-counter",
  ]);

  // 3D View mode: "single" (zone by zone) | "all" (full layout)
  const [zoneViewMode, setZoneViewMode] = useState<"single" | "all">("single");

  // Active Zone index in Step 2 3D workspace
  const [activeZoneIdx, setActiveZoneIdx] = useState<number>(0);

  // Form values for the currently active zone in Step 2 workspace
  const [formLength, setFormLength] = useState<number>(22);

  // Modal states
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);

  // Stored configuration for each zone
  const [configuredZones, setConfiguredZones] = useState<
    Record<string, ConfiguredZoneData>
  >({
    gondola: {
      length: 22,
      height: "53″ Standard",
      depth: "12″ Standard",
      price: 3280,
      fixtures: 6,
      selectedModelFile: "/models/Contemprory/Shelving/Gondola/Gondola-35-Variations/GONDOLA-53-48.glb",
      stepM: 1.0,
    },
    deli: {
      length: 14,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2858,
      fixtures: 4,
      selectedModelFile: "/models/zone-2.glb",
      stepM: 1.0,
    },
    coffee: {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2240,
      fixtures: 4,
      selectedModelFile: "/models/Contemprory/Food & Coffee Area/FA-40-Variations/FA-40.glb",
      stepM: 1.02,
    },
    "front-checkout": {
      length: 12,
      height: "34″ Showcase",
      depth: "30″ Standard",
      price: 2640,
      fixtures: 4,
      selectedModelId: "sc-sliding-34",
      selectedModelFile: "/models/Contemprory/Cashier Area/Display Showcases/SHOWCASE-SLIDING-Variations/SC-Sliding-34.glb",
      stepM: 0.91,
    },
    "back-counter": {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 1572,
      fixtures: 3,
      selectedModelId: "bc-36",
      selectedModelFile: "/models/Contemprory/Cashier Area/Back Counter/BACK-CASHIER-CABINET-Variations/BC-36.glb",
      stepM: 0.97,
    },
    countertop: {
      length: 8,
      height: "34″ Showcase",
      depth: "18″ Standard",
      price: 1420,
      fixtures: 3,
      selectedModelId: "ct-showcase-34",
      selectedModelFile: "/models/Contemprory/Cashier Area/Countertop/Countertop-Shelves-Variations/Countertop-Shelves-34.glb",
      stepM: 0.86,
    },
    jewellery: {
      length: 12,
      height: "34″ Showcase",
      depth: "24″ Standard",
      price: 3650,
      fixtures: 4,
      selectedModelId: "jw-hinged-34",
      selectedModelFile: "/models/Contemprory/Cashier Area/Display Showcases/SHOWCASE-HINGED-Variations/SC-Hinged-34.glb",
      stepM: 0.90,
    },
    endcap: {
      length: 8,
      height: "53″ Standard",
      depth: "16″ Standard",
      price: 1760,
      fixtures: 2,
      selectedModelId: "endcap-std-35",
      selectedModelFile: "/models/Contemprory/Shelving/Endcap/Endcap-35-Variations/Endcap-35.glb",
      stepM: 0.89,
    },
    "wall-shelve": {
      length: 16,
      height: "77″ Standard",
      depth: "16″ Standard",
      price: 3160,
      fixtures: 4,
      selectedModelId: "std-wall-shelve",
      selectedModelFile: "/models/Contemprory/Shelving/Wall/WALL-SHELVE-Variations/WALL-SHELVE-77-39.glb",
      stepM: 1.0,
    },
    "bakery-showcase": {
      length: 10,
      height: "48″ Standard",
      depth: "28″ Standard",
      price: 2900,
      fixtures: 2,
      selectedModelId: "std-bakery-unit",
      selectedModelFile: "/models/Contemprory/Shelving/Endcap/ENDCAP BAKERY SHOWCASES.glb",
      stepM: 0.95,
    },
  });

  // Slot swaps / single unit overrides
  const [selectedUnit, setSelectedUnit] = useState<{
    zoneId: string;
    unitIndex: number;
  } | null>(null);

  const [unitSwaps, setUnitSwaps] = useState<
    Record<string, Record<number, string>>
  >({});

  // Current active store type
  const currentStore = useMemo(() => {
    return (
      STORE_TYPES.find((s) => s.id === selectedStoreId) ?? STORE_TYPES[0]
    );
  }, [selectedStoreId]);

  // Clamp activeZoneIdx if selectedZoneIds shrinks
  useEffect(() => {
    if (activeZoneIdx >= selectedZoneIds.length) {
      setActiveZoneIdx(Math.max(0, selectedZoneIds.length - 1));
    }
  }, [selectedZoneIds.length, activeZoneIdx]);

  // Current active zone object in Step 2 workspace
  const currentActiveZone = useMemo(() => {
    const currentId = selectedZoneIds[activeZoneIdx] || selectedZoneIds[0] || "gondola";
    return ZONES.find((z) => z.id === currentId) ?? ZONES[0];
  }, [selectedZoneIds, activeZoneIdx]);

  // Track completed/visited zones
  const [completedZoneIds, setCompletedZoneIds] = useState<string[]>([]);
  const [zoneSwitchNotification, setZoneSwitchNotification] = useState<string | null>(null);

  const isLastZone = activeZoneIdx === selectedZoneIds.length - 1;
  const nextZoneId = !isLastZone ? selectedZoneIds[activeZoneIdx + 1] : null;
  const nextZoneDef = nextZoneId ? ZONES.find((z) => z.id === nextZoneId) : null;
  const prevZoneId = activeZoneIdx > 0 ? selectedZoneIds[activeZoneIdx - 1] : null;
  const prevZoneDef = prevZoneId ? ZONES.find((z) => z.id === prevZoneId) : null;

  // Sync form inputs when active zone changes
  useEffect(() => {
    if (!currentActiveZone) return;
    const existing = configuredZones[currentActiveZone.id];
    if (existing) {
      setFormLength(existing.length);
    } else {
      setFormLength(currentActiveZone.refLen);
    }
  }, [currentActiveZone, configuredZones]);

  // Navigate to Next Zone
  const handleNextZone = () => {
    setSelectedUnit(null);
    if (currentActiveZone && !completedZoneIds.includes(currentActiveZone.id)) {
      setCompletedZoneIds((prev) => [...prev, currentActiveZone.id]);
    }

    if (!isLastZone) {
      const nextIdx = activeZoneIdx + 1;
      setActiveZoneIdx(nextIdx);
      const nextName = nextZoneDef?.label || "Next Zone";
      setZoneSwitchNotification(`✓ Saved ${currentActiveZone?.label || "Zone"} — Now configuring: ${nextName}`);
      setTimeout(() => setZoneSwitchNotification(null), 3500);
    } else {
      setStep(3);
    }
  };

  // Navigate to Previous Zone
  const handlePrevZone = () => {
    setSelectedUnit(null);
    if (activeZoneIdx > 0) {
      const prevIdx = activeZoneIdx - 1;
      setActiveZoneIdx(prevIdx);
      const prevName = prevZoneDef?.label || "Previous Zone";
      setZoneSwitchNotification(`Now viewing: ${prevName}`);
      setTimeout(() => setZoneSwitchNotification(null), 3000);
    }
  };

  // Handle unit click in 3D scene
  const handleUnitClick = (zoneId: string, unitIndex: number) => {
    const zIdx = selectedZoneIds.indexOf(zoneId);
    if (zIdx !== -1) {
      setActiveZoneIdx(zIdx);
    }
    setSelectedUnit({ zoneId, unitIndex });
  };

  // Handle updating wall length from input field
  const handleUpdateWallLength = (newLenFt: number) => {
    if (!currentActiveZone) return;
    const len = Math.max(2, Math.min(60, newLenFt));
    setFormLength(len);

    const ratio = len / currentActiveZone.refLen;
    const calculatedPrice = Math.round(currentActiveZone.basePrice * ratio);
    const calculatedFixtures = Math.max(
      1,
      Math.round(currentActiveZone.fixtures * ratio)
    );

    setConfiguredZones((prev) => ({
      ...prev,
      [currentActiveZone.id]: {
        ...(prev[currentActiveZone.id] || {
          height: currentActiveZone.heightOptions[0],
          depth: currentActiveZone.depthOptions[0],
        }),
        length: len,
        price: calculatedPrice,
        fixtures: calculatedFixtures,
      },
    }));
  };

  // Add product bay unit to active zone
  const handleAddProduct = () => {
    if (!currentActiveZone) return;
    const currentConf = configuredZones[currentActiveZone.id] || {
      length: currentActiveZone.refLen,
      height: currentActiveZone.heightOptions[0],
      depth: currentActiveZone.depthOptions[0],
      fixtures: currentActiveZone.fixtures,
      price: currentActiveZone.basePrice,
    };

    const bayFt = Math.max(2, Math.round(currentActiveZone.refLen / Math.max(1, currentActiveZone.fixtures))) || 4;
    const nextFixtures = currentConf.fixtures + 1;
    const nextLength = currentConf.length + bayFt;
    const nextPrice = Math.round((currentActiveZone.basePrice * nextLength) / currentActiveZone.refLen);

    setFormLength(nextLength);
    setConfiguredZones((prev) => ({
      ...prev,
      [currentActiveZone.id]: {
        ...currentConf,
        fixtures: nextFixtures,
        length: nextLength,
        price: nextPrice,
      },
    }));
  };

  // Remove a product bay unit from active zone
  const handleRemoveProduct = (unitIndex: number) => {
    if (!currentActiveZone) return;
    const currentConf = configuredZones[currentActiveZone.id] || {
      length: currentActiveZone.refLen,
      height: currentActiveZone.heightOptions[0],
      depth: currentActiveZone.depthOptions[0],
      fixtures: currentActiveZone.fixtures,
      price: currentActiveZone.basePrice,
    };

    if (currentConf.fixtures > 1) {
      const bayFt = Math.max(2, Math.round(currentActiveZone.refLen / Math.max(1, currentActiveZone.fixtures))) || 4;
      const nextFixtures = currentConf.fixtures - 1;
      const nextLength = Math.max(4, currentConf.length - bayFt);
      const nextPrice = Math.round((currentActiveZone.basePrice * nextLength) / currentActiveZone.refLen);

      setFormLength(nextLength);
      setConfiguredZones((prev) => ({
        ...prev,
        [currentActiveZone.id]: {
          ...currentConf,
          fixtures: nextFixtures,
          length: nextLength,
          price: nextPrice,
        },
      }));

      // Shift unit swaps for remaining bays
      setUnitSwaps((prev) => {
        const zoneMap = { ...(prev[currentActiveZone.id] || {}) };
        delete zoneMap[unitIndex];
        const newMap: Record<number, string> = {};
        let newIdx = 0;
        for (let i = 0; i < currentConf.fixtures; i++) {
          if (i === unitIndex) continue;
          if (zoneMap[i]) {
            newMap[newIdx] = zoneMap[i];
          }
          newIdx++;
        }
        return {
          ...prev,
          [currentActiveZone.id]: newMap,
        };
      });

      if (selectedUnit?.unitIndex === unitIndex) {
        setSelectedUnit(null);
      }
    }
  };

  // Handle picking a slot standard replacement for a specific product unit
  const handlePickStandard = (
    zoneId: string,
    unitIndex: number,
    standardId: string
  ) => {
    setUnitSwaps((prev) => {
      const zoneMap = { ...(prev[zoneId] || {}) };
      zoneMap[unitIndex] = standardId;
      return {
        ...prev,
        [zoneId]: zoneMap,
      };
    });
  };

  // Toggle zone selection in Step 1.5 or modal (Max 5 zones)
  const toggleZone = (id: string) => {
    setSelectedZoneIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          setZoneSwitchNotification("At least 1 zone must remain selected.");
          setTimeout(() => setZoneSwitchNotification(null), 3000);
          return prev;
        }
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 5) {
          setZoneSwitchNotification("You can select up to 5 zones. Please deselect a zone first to choose another.");
          setTimeout(() => setZoneSwitchNotification(null), 3500);
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Price for a single zone taking base price + model delta + slot deltas
  const getZonePrice = (id: string) => {
    const conf = configuredZones[id];
    const zDef = ZONES.find((z) => z.id === id);
    const base = conf ? conf.price : zDef?.basePrice || 2000;

    const activeOpt = ZONE_MODEL_OPTIONS[id]?.find(
      (m) => m.id === conf?.selectedModelId
    );
    const modelDelta = activeOpt?.delta || 0;

    const swaps = unitSwaps[id] || {};
    const standards = ZONE_STANDARDS[id] || [];
    const deltaSum = Object.values(swaps).reduce((sum, stdId) => {
      const std = standards.find((s) => s.id === stdId || (stdId?.toLowerCase() === "f20t" && s.id === "fa-20t"));
      return sum + (std ? std.delta : 0);
    }, 0);

    return Math.max(100, base + modelDelta + deltaSum);
  };

  // Aggregated total statistics
  const totalFixtures = useMemo(() => {
    return selectedZoneIds.reduce((sum, id) => {
      const entry = configuredZones[id];
      const zDef = ZONES.find((z) => z.id === id);
      return sum + (entry ? entry.fixtures : zDef?.fixtures || 3);
    }, 0);
  }, [selectedZoneIds, configuredZones]);

  const totalPrice = useMemo(() => {
    return selectedZoneIds.reduce((sum, id) => {
      return sum + getZonePrice(id);
    }, 0);
  }, [selectedZoneIds, configuredZones, unitSwaps]);

  // Rows for 3D Visualizer (supports Zone-by-Zone view or Full Layout view)
  const sceneRows = useMemo(() => {
    const idsToRender =
      zoneViewMode === "single" && currentActiveZone
        ? [currentActiveZone.id]
        : selectedZoneIds;

    return idsToRender.map((id) => {
      const zDef = ZONES.find((z) => z.id === id) || ZONES[0];
      const conf = configuredZones[id];
      const lengthFt = conf ? conf.length : zDef.refLen;
      const heightIn = conf
        ? parseInt(conf.height) || zDef.heights[0]
        : zDef.heights[0];

      // Per-bay model file overrides from unitSwaps
      const bayFiles: Record<number, string> = {};
      const swaps = unitSwaps[id];
      if (swaps) {
        const standards = ZONE_STANDARDS[id] || [];
        Object.entries(swaps).forEach(([bayIdxStr, stdId]) => {
          const std = standards.find((s) => s.id === stdId || (stdId?.toLowerCase() === "f20t" && s.id === "fa-20t"));
          if (std?.modelFile) {
            bayFiles[Number(bayIdxStr)] = std.modelFile;
          }
        });
      }

      const activeModelFile = conf?.selectedModelFile || zDef.modelFile;
      const activeStepM = conf?.stepM || zDef.stepM;

      return {
        zone: zDef,
        sel: {
          lengthFt,
          finish: "natural_oak" as const,
          variantId: variantIdForHeight(heightIn),
        },
        bays: conf ? conf.fixtures : zDef.fixtures,
        bayFiles,
        modelFile: activeModelFile,
        stepM: activeStepM,
      };
    });
  }, [zoneViewMode, currentActiveZone, selectedZoneIds, configuredZones, unitSwaps]);

  // Add configured store layout to cart
  const handleAddToCart = () => {
    const cartItems = selectedZoneIds.map((id, index) => {
      const zDef = ZONES.find((z) => z.id === id)!;
      const conf = configuredZones[id];
      const len = conf ? conf.length : zDef.refLen;
      const h = conf ? conf.height : zDef.heightOptions[0];
      const price = getZonePrice(id);
      const fixtures = conf ? conf.fixtures : zDef.fixtures;

      const swaps = unitSwaps[id];
      let swapNote = "";
      if (swaps && Object.keys(swaps).length > 0) {
        const standards = ZONE_STANDARDS[id] || [];
        const swappedNames = Object.values(swaps)
          .map((sId) => standards.find((s) => s.id === sId || (sId === "f20t" && s.id === "fa-20t"))?.label)
          .filter(Boolean);
        if (swappedNames.length > 0) {
          swapNote = ` · ${swappedNames.join(", ")}`;
        }
      }

      return {
        id: `cfg-${currentStore.id}-${id}-${Date.now()}-${index}`,
        title: `${zDef.label} (${currentStore.name}) — ${len}'L · ${fixtures} fixtures · ${h}${swapNote}`,
        price: Math.round(price),
        image: zDef.cartImage,
        quantity: 1,
      };
    });

    addBundle(cartItems, { open: true });
    setStep(2);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-64px)] min-h-0 flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* Floating Global Notification Toast */}
      {zoneSwitchNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-950/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl border border-white/20 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250 pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{zoneSwitchNotification}</span>
        </div>
      )}
      
      {/* ════════════════════════════════════════════════════════════
          STEP 1: SELECT YOUR STORE TYPE (Matches Images 1 & 2)
         ════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
          <div className="text-center mb-8 sm:mb-12 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Select your store type
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2">
              To start your project we need to customize your preferences.
            </p>
          </div>

          {/* 4 Store Type Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl mb-8 sm:mb-12">
            {STORE_TYPES.map((st) => {
              const isSelected = selectedStoreId === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedStoreId(st.id);
                    // Preselect the 5 core retail zones
                    setSelectedZoneIds(["gondola", "deli", "coffee", "front-checkout", "back-counter"]);
                  }}
                  className={`rounded-3xl border bg-white p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-between text-center min-h-[260px] sm:min-h-[300px] ${
                    isSelected
                      ? "border-2 border-[#D92C32] shadow-xl bg-red-50/10 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {/* Store Isometric Illustration */}
                  <div className="w-full flex-1 flex items-center justify-center p-2 mb-4">
                    <img
                      src={
                        st.id === "cstore"
                          ? "/store_type_convenience.jpg"
                          : st.id === "grocery"
                          ? "/store_type_grocery.jpg"
                          : st.id === "truck"
                          ? "/store_type_truck_stop.jpg"
                          : "/store_type_jewellery.jpg"
                      }
                      alt={st.name}
                      className="max-h-36 sm:max-h-44 object-contain rounded-2xl drop-shadow-sm"
                    />
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-extrabold leading-tight ${
                      isSelected ? "text-[#D92C32]" : "text-gray-950"
                    }`}
                  >
                    {st.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Pagination indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-8 py-2.5 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-100 text-xs font-extrabold transition-all cursor-pointer"
            >
              EXIT
            </button>
            <button
              type="button"
              onClick={() => setStep(1.5)}
              className="px-10 py-2.5 rounded-full bg-[#D92C32] hover:bg-[#b5252a] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>NEXT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 1.5: SELECT ALL NEEDED ZONES (Matches Image 3)
         ════════════════════════════════════════════════════════════ */}
      {step === 1.5 && (
        <main className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full overflow-y-auto animate-in fade-in duration-300">
          <div className="text-center mb-6 sm:mb-8 max-w-xl shrink-0">
            {/* 5-zone status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#D92C32] text-xs font-bold mb-3 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#D92C32]" />
              <span>{selectedZoneIds.length} of 5 zones selected</span>
              {selectedZoneIds.length === 5 ? (
                <span className="bg-[#D92C32] text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  5/5 Selected
                </span>
              ) : (
                <span className="text-gray-500 font-normal">
                  ({5 - selectedZoneIds.length} available)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Select all needed zones for your.. ({currentStore.name})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5">
              You can select up to 5 zones, you can edit this later.
            </p>
          </div>

          {/* Zone Selection Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full max-w-4xl mb-8">
            {ZONES.map((z) => {
              const isSelected = selectedZoneIds.includes(z.id);
              return (
                <div
                  key={z.id}
                  onClick={() => toggleZone(z.id)}
                  className={`rounded-3xl border bg-white p-4 sm:p-5 flex items-center gap-4 transition-all duration-200 cursor-pointer select-none relative ${
                    isSelected
                      ? "border-2 border-[#D92C32] shadow-md bg-red-50/10"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Left 3D Thumbnail Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={z.cartImage}
                      alt={z.label}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  {/* Right Info & Checkbox */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-950 leading-tight">
                        {z.label}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#D92C32]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {z.tagline || z.desc || "High-capacity retail shelving engineered for durability and modular merchandise arrangement."}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                      <span>{z.defaultLenFt}' Run · {z.fixtures} Fixtures</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-bold text-gray-800">{money(z.basePrice)}</span>
                    </div>
                  </div>

                  {/* Checkbox Icon Top Right */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#D92C32] text-white shadow-xs"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pb-6 shrink-0">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-8 py-2.5 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-100 text-xs font-extrabold transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-10 py-2.5 rounded-full bg-[#D92C32] hover:bg-[#b5252a] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start ({selectedZoneIds.length} Zones)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2: 3D CONFIGURATOR WORKSPACE (Matches Images 4 & 5)
         ════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <main className="relative flex-1 flex flex-col p-2.5 sm:p-4 lg:p-6 max-w-[1500px] w-full mx-auto overflow-y-auto lg:overflow-hidden animate-in fade-in duration-300">
          {/* ── SUB-HEADER: ZONE TABS BAR & ACTIONS (Matches Images 4 & 5) ── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3 sm:mb-4 bg-white border border-gray-200 rounded-2xl p-2 sm:px-4 sm:py-2.5 shadow-2xs shrink-0">
            {/* Horizontal Zone Tabs with Progress Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth shrink-0 w-full sm:w-auto">
              {selectedZoneIds.map((zId, idx) => {
                const zDef = ZONES.find((z) => z.id === zId);
                const isActive = activeZoneIdx === idx;
                const isCompleted = completedZoneIds.includes(zId);
                return (
                  <button
                    key={zId}
                    type="button"
                    onClick={() => {
                      setSelectedUnit(null);
                      setActiveZoneIdx(idx);
                    }}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "border-2 border-[#D92C32] text-[#D92C32] bg-red-50/25 shadow-2xs"
                        : isCompleted
                        ? "border border-emerald-300 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-50"
                        : "text-gray-700 hover:text-gray-950 hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-[#D92C32] text-white"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span>{zDef?.label || `Zone (${zId})`}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Sub-Header Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              {/* Zone-by-Zone View Toggle */}
              <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-gray-100 border border-gray-200 text-[11px] sm:text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setZoneViewMode("single")}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    zoneViewMode === "single"
                      ? "bg-white text-gray-950 shadow-2xs font-extrabold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Zone View
                </button>
                <button
                  type="button"
                  onClick={() => setZoneViewMode("all")}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    zoneViewMode === "all"
                      ? "bg-[#fff] text-gray-950 shadow-2xs font-extrabold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Full Layout
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsZoneModalOpen(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[11px] sm:text-xs font-extrabold text-gray-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-600" />
                <span className="hidden sm:inline">Add / Remove zones</span>
                <span className="sm:hidden">Zones</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white text-[11px] sm:text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Finish
              </button>
            </div>
          </div>

          {/* ── MAIN WORKSPACE: 3D VIEWPORT (LEFT) + CONFIGURATOR SIDEBAR (RIGHT) ── */}
          <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-6 min-h-0 overflow-y-auto">
            
            {/* Left 3D Viewport Box */}
            <div className="w-full flex-1 min-h-[380px] lg:min-h-0 flex flex-col">
              <StoreLayoutPreview
                rows={sceneRows}
                totalPrice={totalPrice}
                totalFixtures={totalFixtures}
                selectedCount={selectedZoneIds.length}
                onUnitClick={handleUnitClick}
                selectedUnit={selectedUnit}
                onDeselectUnit={() => setSelectedUnit(null)}
              />
            </div>

            {/* Right Configurator Sidebar Panel (Matches Images 4 & 5) */}
            <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 shrink-0 overflow-y-auto pr-0.5">
              
              {/* Zone Step & Progress Badge */}
              <div className="bg-white rounded-2xl border border-gray-200/90 px-4 py-3 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-red-50 text-[#D92C32] font-extrabold text-xs flex items-center justify-center">
                    {activeZoneIdx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-extrabold text-gray-950 block">
                      Zone {activeZoneIdx + 1} of {selectedZoneIds.length}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">
                      {isLastZone ? "Final zone to configure" : `Next up: ${nextZoneDef?.label || "Next Zone"}`}
                    </span>
                  </div>
                </div>
                <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D92C32] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.round(((activeZoneIdx + 1) / selectedZoneIds.length) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* TOP CARD: Zone Details & Wall Length */}
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 leading-tight">
                  {currentActiveZone.label}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  Wall Length: <span className="text-gray-900 font-bold">{formLength} ft</span>
                </p>

                {/* Wall Length Input Field (Image 4 & 5) */}
                <div className="mt-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#D92C32] mb-1.5">
                    Wall Length
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formLength}
                      onChange={(e) => handleUpdateWallLength(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-sm font-bold text-gray-950 rounded-2xl border-2 border-[#D92C32] focus:outline-none bg-white shadow-2xs"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                      ft
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM CARD: Products List / Fixture Bays (Matches Images 4 & 5) */}
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-gray-950">
                    Products List
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="text-xs font-extrabold text-[#D92C32] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Add Product</span>
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* List of Product Bay Items */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {Array.from({ length: configuredZones[currentActiveZone.id]?.fixtures || currentActiveZone.fixtures }).map((_, idx) => {
                    const isUnitSelected = selectedUnit?.zoneId === currentActiveZone.id && selectedUnit.unitIndex === idx;
                    const currentSwappedId = unitSwaps[currentActiveZone.id]?.[idx];
                    const standards = ZONE_STANDARDS[currentActiveZone.id] || [];
                    const currentStd = standards.find((s) => s.id === currentSwappedId || (currentSwappedId?.toLowerCase() === "f20t" && s.id === "fa-20t"));

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl transition-all ${
                          isUnitSelected
                            ? "border-2 border-[#D92C32] bg-white p-3.5 shadow-sm"
                            : "border border-gray-200 bg-white p-3 hover:border-gray-300"
                        }`}
                      >
                        {/* Product Header Row */}
                        <div
                          onClick={() => {
                            if (isUnitSelected) {
                              setSelectedUnit(null);
                            } else {
                              setSelectedUnit({ zoneId: currentActiveZone.id, unitIndex: idx });
                            }
                          }}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Product Thumbnail Image */}
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={currentActiveZone.cartImage}
                                alt={`Product ${idx + 1}`}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-extrabold text-gray-950 truncate leading-tight">
                                Product {idx + 1}
                              </h4>
                              <p className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">
                                {currentStd ? currentStd.label : `${currentActiveZone.label} Unit`}
                              </p>
                            </div>
                          </div>

                          {/* Right Controls: Replace Unit / Close Button + Trash Icon */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isUnitSelected) {
                                  setSelectedUnit(null);
                                } else {
                                  setSelectedUnit({ zoneId: currentActiveZone.id, unitIndex: idx });
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                                isUnitSelected
                                  ? "bg-[#D92C32] text-white shadow-2xs"
                                  : "border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                              }`}
                              title="Replace this product unit"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>{isUnitSelected ? "Close" : "Replace Unit"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProduct(idx);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* ── INLINE REPLACEMENT LIST (MATCHES IMAGE ATTACHMENT) ── */}
                        {isUnitSelected && (
                          <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-2 animate-in fade-in duration-200">
                            <div className="px-0.5 mb-1.5">
                              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#D92C32]">
                                REPLACEMENT FOR PRODUCT {idx + 1}
                              </span>
                            </div>

                            {standards.length > 0 ? (
                              <div className="space-y-1.5">
                                  {standards.map((std) => {
                                    const isChosen =
                                      (currentSwappedId || standards[0]?.id) === std.id ||
                                      (currentSwappedId?.toLowerCase() === "f20t" && std.id === "fa-20t");
                                  return (
                                    <div
                                      key={std.id}
                                      onClick={() => handlePickStandard(currentActiveZone.id, idx, std.id)}
                                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                                        isChosen
                                          ? "border-2 border-[#D92C32] bg-red-50/20 text-[#D92C32] font-extrabold shadow-2xs"
                                          : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${isChosen ? "border-[#D92C32] bg-[#D92C32] text-white" : "border-gray-300 bg-white"}`}>
                                          {isChosen && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                        <img
                                          src={currentActiveZone.cartImage}
                                          alt={std.label}
                                          className="w-7 h-7 object-contain rounded bg-gray-50 p-0.5 border border-gray-200 shrink-0"
                                        />
                                        <span className="truncate">{std.label}</span>
                                      </div>
                                      <span className={`text-[11px] font-extrabold shrink-0 ${std.delta === 0 ? "text-emerald-600" : "text-[#D92C32]"}`}>
                                        {std.delta === 0 ? "$0" : `+$${std.delta}`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500 text-center py-2">
                                Standard unit layout for this product.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── ZONE COMPLETION & NAVIGATION CONTROLS (NEXT ZONE) ── */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-xs shrink-0 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D92C32] animate-pulse" />
                    <span className="font-extrabold text-gray-900">
                      Step {activeZoneIdx + 1} of {selectedZoneIds.length}: {currentActiveZone.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#D92C32] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                    {isLastZone ? "Ready to Finish" : `Next: ${nextZoneDef?.label || "Next Zone"}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeZoneIdx > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevZone}
                      className="px-3.5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                      title={prevZoneDef ? `Back to ${prevZoneDef.label}` : "Previous Zone"}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleNextZone}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-[#D92C32] hover:bg-[#b5252a] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {!isLastZone ? (
                      <>
                        <span>Next Zone: {nextZoneDef?.label || "Next Zone"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Finish & Review Store Layout</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 text-center font-medium">
                  {!isLastZone
                    ? `Saves ${currentActiveZone.label} and advances directly to ${nextZoneDef?.label}.`
                    : "All store zones configured! Proceed to layout summary & bill of materials."}
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3: REVIEW & FINISH SUMMARY MODAL / DRAWER
         ════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xl w-full">
            <div className="text-center mb-8">
              <span className="w-12 h-12 rounded-full bg-red-50 text-[#D92C32] inline-flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                Your Store Layout Summary
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Review your configured layout before adding to cart or requesting a formal quote.
              </p>
            </div>

            {/* Configured Zones List */}
            <div className="divide-y divide-gray-100 mb-8">
              {selectedZoneIds.map((zId) => {
                const zDef = ZONES.find((z) => z.id === zId);
                const conf = configuredZones[zId];
                const price = getZonePrice(zId);
                return (
                  <div key={zId} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={zDef?.cartImage} alt={zDef?.label} className="w-12 h-12 object-contain rounded-xl bg-gray-50 border p-1" />
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-950">{zDef?.label}</h4>
                        <p className="text-xs text-gray-500">{conf?.length || zDef?.refLen} ft · {conf?.fixtures || zDef?.fixtures} Fixture Units</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-950">{money(price)}</span>
                  </div>
                );
              })}
            </div>

            {/* Total Footer */}
            <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Estimated Total</span>
                <span className="text-xs text-gray-400 font-normal">Includes hardware & modular units</span>
              </div>
              <span className="text-2xl font-black text-gray-950">{money(totalPrice)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-full border border-gray-300 text-gray-800 text-xs font-extrabold hover:bg-gray-50 transition-all cursor-pointer text-center"
              >
                Back to 3D Editor
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-full bg-[#D92C32] hover:bg-[#b5252a] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer text-center"
              >
                Add Store to Cart
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ════════════════════════════════════════════════════════════
          ADD/REMOVE ZONES MODAL (ON THE FLY)
         ════════════════════════════════════════════════════════════ */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-lg font-extrabold text-gray-950">Add or Remove Store Zones</h3>
              <button
                type="button"
                onClick={() => setIsZoneModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 mb-6">
              {ZONES.map((z) => {
                const isSelected = selectedZoneIds.includes(z.id);
                return (
                  <div
                    key={z.id}
                    onClick={() => toggleZone(z.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#D92C32] bg-red-50/15"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={z.cartImage} alt={z.label} className="w-12 h-12 object-contain rounded-xl bg-gray-50 border p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-950 truncate">{z.label}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{z.subLabel}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? "bg-[#D92C32] text-white" : "border border-gray-300"}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsZoneModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#D92C32] hover:bg-[#b5252a] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Update Layout
            </button>
          </div>
        </div>
      )}

    </div>
  );
}