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
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import type { SceneView } from "./StoreScene";
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
  selectedModelId?: string;
  selectedModelFile?: string;
  stepM?: number;
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
  const [formModelId, setFormModelId] = useState<string>("sc-sliding-34");
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
      selectedModelId: "tall-wall",
      selectedModelFile: "/models/zone-1.glb",
      stepM: 1.0,
    },
    deli: {
      length: 14,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2858,
      fixtures: 4,
      swapOption: "Standard",
      selectedModelFile: "/models/zone-2.glb",
      stepM: 1.0,
    },
    coffee: {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 2240,
      fixtures: 4,
      swapOption: "Standard",
      selectedModelFile: "/models/zone-4.glb",
      stepM: 2.49,
    },
    "front-checkout": {
      length: 12,
      height: "34″ Showcase",
      depth: "30″ Standard",
      price: 2640,
      fixtures: 4,
      swapOption: "Standard",
      selectedModelId: "sc-sliding-34",
      selectedModelFile: "/models/cashier/sc-sliding-34.glb",
      stepM: 0.91,
    },
    "back-counter": {
      length: 10,
      height: "36″ Standard",
      depth: "24″ Standard",
      price: 1572,
      fixtures: 3,
      swapOption: "Standard",
      selectedModelId: "bc-36",
      selectedModelFile: "/models/cashier/bc-36.glb",
      stepM: 0.97,
    },
  });

  // Step 3: Camera view and swap simulator
  const [view, setView] = useState<SceneView>("3q");
  const [activeSwapZoneId, setActiveSwapZoneId] = useState<string>("deli");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);

  // Step 5: Replace a single unit state
  // selectedUnit tracks which zone and bay index is clicked in 3D
  const [selectedUnit, setSelectedUnit] = useState<{
    zoneId: string;
    unitIndex: number;
  } | null>(null);

  // unitSwaps stores per-zone, per-bay standard option selection:
  // zoneId -> bayIndex -> standardOptionId
  const [unitSwaps, setUnitSwaps] = useState<
    Record<string, Record<number, string>>
  >({});

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

  // Handle clicking a unit in 3D
  const handleUnitClick = (zoneId: string, unitIndex: number) => {
    setSelectedUnit({ zoneId, unitIndex });
  };

  // Floating 3D "Edit" action
  const handleEditUnit = (zoneId: string, unitIndex: number) => {
    setSelectedUnit({ zoneId, unitIndex });
  };

  // Floating 3D "Add" (+) action: adds one more bay to the selected zone
  const handleAddUnit = (zoneId: string, _unitIndex: number) => {
    const zDef = ZONES.find((z) => z.id === zoneId);
    if (!zDef) return;

    const currentConf = configuredZones[zoneId] || {
      length: zDef.refLen,
      height: zDef.heightOptions[0],
      depth: zDef.depthOptions[0],
      fixtures: zDef.fixtures,
      price: zDef.basePrice,
    };

    const bayFt = Math.max(2, Math.round(zDef.refLen / Math.max(1, zDef.fixtures))) || 4;
    const nextFixtures = currentConf.fixtures + 1;
    const nextLength = currentConf.length + bayFt;
    const nextPrice = Math.round((zDef.basePrice * nextLength) / zDef.refLen);

    setConfiguredZones((prev) => ({
      ...prev,
      [zoneId]: {
        ...currentConf,
        fixtures: nextFixtures,
        length: nextLength,
        price: nextPrice,
      },
    }));

    setSelectedUnit({ zoneId, unitIndex: nextFixtures - 1 });
  };

  // Floating 3D "Remove" action: removes a bay or removes the zone
  const handleRemoveUnit = (zoneId: string, unitIndex: number) => {
    const zDef = ZONES.find((z) => z.id === zoneId);
    if (!zDef) return;

    const currentConf = configuredZones[zoneId] || {
      length: zDef.refLen,
      height: zDef.heightOptions[0],
      depth: zDef.depthOptions[0],
      fixtures: zDef.fixtures,
      price: zDef.basePrice,
    };

    if (currentConf.fixtures > 1) {
      const bayFt = Math.max(2, Math.round(zDef.refLen / Math.max(1, zDef.fixtures))) || 4;
      const nextFixtures = currentConf.fixtures - 1;
      const nextLength = Math.max(4, currentConf.length - bayFt);
      const nextPrice = Math.round((zDef.basePrice * nextLength) / zDef.refLen);

      setConfiguredZones((prev) => ({
        ...prev,
        [zoneId]: {
          ...currentConf,
          fixtures: nextFixtures,
          length: nextLength,
          price: nextPrice,
        },
      }));

      // Shift unit swaps for remaining bays
      setUnitSwaps((prev) => {
        const zoneMap = { ...(prev[zoneId] || {}) };
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
          [zoneId]: newMap,
        };
      });

      if (unitIndex >= nextFixtures) {
        setSelectedUnit({ zoneId, unitIndex: nextFixtures - 1 });
      }
    } else {
      // 1 fixture remaining: remove this zone from the store if other zones exist
      if (selectedZoneIds.length > 1) {
        setSelectedZoneIds((prev) => prev.filter((id) => id !== zoneId));
        setSelectedUnit(null);
      }
    }
  };

  // Handle picking a slot standard to swap in place
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

  // Price for a single zone taking base price + selected model delta + any slot standard deltas
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
      const std = standards.find((s) => s.id === stdId);
      return sum + (std ? std.delta : 0);
    }, 0);

    return Math.max(100, base + modelDelta + deltaSum);
  };

  // Live estimate for the zone currently being edited (Step 2)
  const currentZoneEstimate = useMemo(() => {
    if (!currentActiveZone) return 0;
    const len = Number(formLength);
    if (isNaN(len) || len <= 0) return 0;
    const base = Math.round((currentActiveZone.basePrice * len) / currentActiveZone.refLen);

    const activeOpt = ZONE_MODEL_OPTIONS[currentActiveZone.id]?.find(
      (m) => m.id === formModelId
    );
    const modelDelta = activeOpt?.delta || 0;

    const swaps = unitSwaps[currentActiveZone.id] || {};
    const standards = ZONE_STANDARDS[currentActiveZone.id] || [];
    const deltaSum = Object.values(swaps).reduce((sum, stdId) => {
      const std = standards.find((s) => s.id === stdId);
      return sum + (std ? std.delta : 0);
    }, 0);

    return Math.max(100, base + modelDelta + deltaSum);
  }, [currentActiveZone, formLength, formModelId, unitSwaps]);

  // Sync form inputs when active zone changes in Step 2
  const loadZoneConfig = (zoneId: string) => {
    const zDef = ZONES.find((z) => z.id === zoneId);
    if (!zDef) return;
    const existing = configuredZones[zoneId];
    const defaultModel = ZONE_MODEL_OPTIONS[zoneId]?.[0];
    if (existing) {
      setFormLength(existing.length);
      setFormHeight(existing.height);
      setFormDepth(existing.depth);
      setFormModelId(existing.selectedModelId || defaultModel?.id || "");
      setIsRangeExceeded(existing.length < 4 || existing.length > 40);
    } else {
      setFormLength(zDef.refLen);
      setFormHeight(zDef.heightOptions[0]);
      setFormDepth(zDef.depthOptions[0]);
      setFormModelId(defaultModel?.id || "");
      setIsRangeExceeded(false);
    }
  };

  // Handle choosing a model / showcase fixture in Step 2
  const handleSelectModel = (opt: ModelOption) => {
    setFormModelId(opt.id);
    if (opt.widthInches === 48 && currentActiveZone.heightOptions.includes("48″ Showcase")) {
      setFormHeight("48″ Showcase");
    } else if (opt.widthInches === 34 && currentActiveZone.heightOptions.includes("34″ Showcase")) {
      setFormHeight("34″ Showcase");
    } else if (opt.widthInches === 48 && currentActiveZone.heightOptions.includes("48″ Standard")) {
      setFormHeight("48″ Standard");
    } else if (opt.widthInches === 36 && currentActiveZone.heightOptions.includes("36″ Standard")) {
      setFormHeight("36″ Standard");
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

    const currentModelOpt =
      ZONE_MODEL_OPTIONS[currentActiveZone.id]?.find((m) => m.id === formModelId) ||
      ZONE_MODEL_OPTIONS[currentActiveZone.id]?.[0];

    const updatedConfig: ConfiguredZoneData = {
      length: len,
      height: formHeight,
      depth: formDepth,
      price: calculatedPrice,
      fixtures: calculatedFixtures,
      swapOption: configuredZones[currentActiveZone.id]?.swapOption || "Standard",
      selectedModelId: currentModelOpt?.id,
      selectedModelFile: currentModelOpt?.file,
      stepM: currentModelOpt?.stepM,
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
      return sum + getZonePrice(id);
    }, 0);
  }, [selectedZoneIds, configuredZones, unitSwaps, formModelId]);

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

      // Per-bay model file overrides from unitSwaps
      const bayFiles: Record<number, string> = {};
      const swaps = unitSwaps[id];
      if (swaps) {
        const standards = ZONE_STANDARDS[id] || [];
        Object.entries(swaps).forEach(([bayIdxStr, stdId]) => {
          const std = standards.find((s) => s.id === stdId);
          if (std?.modelFile) {
            bayFiles[Number(bayIdxStr)] = std.modelFile;
          }
        });
      }

      // Check if current active zone is being previewed with live model selection in Step 2
      const liveModelOpt =
        step === 2 && id === currentActiveZone?.id && formModelId
          ? ZONE_MODEL_OPTIONS[id]?.find((m) => m.id === formModelId)
          : null;

      const activeModelFile =
        liveModelOpt?.file ||
        conf?.selectedModelFile ||
        zDef.modelFile;

      const activeStepM =
        liveModelOpt?.stepM ||
        conf?.stepM ||
        zDef.stepM;

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
  }, [step, selectedZoneIds, activeZoneIdx, configuredZones, unitSwaps, currentActiveZone, formModelId]);

  // Add configured store to cart
  const handleAddToCart = () => {
    const cartItems = selectedZoneIds.map((id, index) => {
      const zDef = ZONES.find((z) => z.id === id)!;
      const conf = configuredZones[id];
      const len = conf ? conf.length : zDef.refLen;
      const h = conf ? conf.height : zDef.heightOptions[0];
      const price = getZonePrice(id);
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
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#faf9f7] text-gray-900 font-sans">

      {/* ════════════════════════════════════════════════════════════
          TOP HEADER: SINGLE PROGRESS SYSTEM (Matches Recommended Structure)
         ════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between z-30">
        {/* Brand indicator */}
        <div className="flex items-center gap-2 text-xs font-black tracking-tight text-gray-950 uppercase hidden md:flex">
          <span className="text-[#D92C32]">T Shop</span> Configurator
        </div>

        {/* Centered Single Progress Stepper */}
        <div className="flex items-center gap-2 sm:gap-6 mx-auto">
          {/* 1 Choose Zones */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1
                  ? "bg-[#D92C32] text-white shadow-sm"
                  : step > 1
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
            </span>
            <span
              className={`text-xs sm:text-sm font-bold ${
                step === 1
                  ? "text-gray-950"
                  : "text-gray-500 group-hover:text-gray-900"
              }`}
            >
              Choose Zones
            </span>
          </button>

          <div className="w-6 sm:w-12 h-[1px] bg-gray-200" />

          {/* 2 Configure */}
          <button
            type="button"
            onClick={() => {
              if (selectedZoneIds.length > 0) setStep(2);
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2
                  ? "bg-[#D92C32] text-white shadow-sm"
                  : step > 2
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
            </span>
            <span
              className={`text-xs sm:text-sm font-bold ${
                step === 2
                  ? "text-gray-950"
                  : "text-gray-500 group-hover:text-gray-900"
              }`}
            >
              Configure
            </span>
          </button>

          <div className="w-6 sm:w-12 h-[1px] bg-gray-200" />

          {/* 3 Review */}
          <button
            type="button"
            onClick={() => {
              if (selectedZoneIds.length > 0) setStep(3);
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 3
                  ? "bg-[#D92C32] text-white shadow-sm"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              3
            </span>
            <span
              className={`text-xs sm:text-sm font-bold ${
                step === 3
                  ? "text-gray-950"
                  : "text-gray-500 group-hover:text-gray-900"
              }`}
            >
              Review
            </span>
          </button>
        </div>

        <div className="hidden md:block w-24" />
      </div>

      {/* ════════════════════════════════════════════════════════════
          MAIN WORKSPACE: 3D VIEWPORT (LEFT) + WIDENED PANEL (RIGHT)
         ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* 3D VIEWPORT CONTAINER (Stays large, but camera is closer) */}
        <div className="relative flex-1 lg:flex-none lg:w-[58%] xl:w-[60%] h-[34vh] sm:h-[40vh] lg:h-auto overflow-hidden bg-[#faf9f7] lg:border-r border-gray-200">
          <StoreScene
            rows={sceneRows}
            view={step === 3 ? view : "3q"}
            onUnitClick={handleUnitClick}
            selectedUnit={selectedUnit}
          />

          {/* 3D View badge top-right */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-sm pointer-events-none">
              <Boxes className="w-3.5 h-3.5 text-[#D92C32]" />
              <span>3D View</span>
            </div>
          </div>

          {/* Camera views bottom-left */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md">
              {(["front", "3q", "top"] as SceneView[]).map((v) => {
                const isSel = (step === 3 ? view : "3q") === v;
                const label = v === "front" ? "Front" : v === "3q" ? "Angle" : "Top";
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

          {/* Active Unit Indicator pill top center */}
          {selectedUnit && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 bg-[#D92C32] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <span>
                  Active: {ZONES.find((z) => z.id === selectedUnit.zoneId)?.label} · Slot #{selectedUnit.unitIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedUnit(null)}
                  className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer ml-1"
                  title="Deselect unit"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
            WIDENED CONFIGURATION & SELECTION PANEL (RIGHT)
           ════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 flex-1 lg:flex-none lg:w-[42%] xl:w-[40%] flex flex-col bg-white overflow-hidden min-h-0 border-t lg:border-t-0">
          {/* Grab Handle for Mobile */}
          <div className="lg:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1.5 shrink-0 cursor-pointer" />

        {/* ── STEP 5: REPLACE A SINGLE UNIT (ACTIVE WHEN CLICKED IN 3D OR SLOT CHIP) ── */}
        {selectedUnit ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden animate-in fade-in">
            {/* Header matching Recommended Structure */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-950 leading-tight">
                  {ZONES.find((z) => z.id === selectedUnit.zoneId)?.label} — Replace Unit {selectedUnit.unitIndex + 1}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Choose a replacement unit for this slot.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Close unit swap"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable list of slot standards */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
              {(ZONE_STANDARDS[selectedUnit.zoneId] || []).map((std) => {
                const currentChosenId =
                  unitSwaps[selectedUnit.zoneId]?.[selectedUnit.unitIndex] ||
                  (ZONE_STANDARDS[selectedUnit.zoneId]?.[0]?.id ?? "");
                const isChosen = currentChosenId === std.id;
                const zoneObj = ZONES.find((z) => z.id === selectedUnit.zoneId);

                return (
                  <div
                    key={std.id}
                    onClick={() =>
                      handlePickStandard(
                        selectedUnit.zoneId,
                        selectedUnit.unitIndex,
                        std.id
                      )
                    }
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center gap-3.5 ${
                      isChosen
                        ? "border-[#D92C32] bg-red-50/25 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                    }`}
                  >
                    {/* 3D product thumbnail on left */}
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <img
                        src={zoneObj?.cartImage || "/models/zone-1.glb"}
                        alt={std.label}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Text info & price delta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-950 leading-tight">
                          {std.label}
                        </h4>
                        {isChosen && (
                          <span className="text-[10px] font-bold text-white bg-[#D92C32] px-2 py-0.5 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                        {std.sub}
                      </p>
                      <div className="mt-1.5">
                        <span
                          className={`text-xs font-bold ${
                            std.delta === 0
                              ? "text-emerald-700"
                              : "text-[#D92C32]"
                          }`}
                        >
                          {std.delta === 0
                            ? "$0 Included"
                            : `+${money(std.delta)} / unit`}
                        </span>
                      </div>
                    </div>

                    {/* Radio checkmark circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isChosen
                          ? "bg-[#D92C32] text-white"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shrink-0 space-y-2">
              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="w-full py-3 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Done with Slot #{selectedUnit.unitIndex + 1}</span>
              </button>
              <p className="text-[10.5px] text-gray-400 text-center font-normal">
                Swap only. No moving, no deleting, no adding.
              </p>
            </div>
          </div>
        ) : (
          <>
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
                            className={`py-2.5 px-2 sm:px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isSelected
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
                            className={`w-full p-2 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none ${isSelected
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
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${isSelected
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
                      const isCompleted =
                        idx < activeZoneIdx || !!configuredZones[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setActiveZoneIdx(idx);
                            loadZoneConfig(id);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${isCurrent
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

                    {/* Fixture / Showcase Style Selector */}
                    {ZONE_MODEL_OPTIONS[currentActiveZone.id] && ZONE_MODEL_OPTIONS[currentActiveZone.id].length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#D92C32]" />
                            <span>Select Showcase / Fixture Model</span>
                          </label>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {ZONE_MODEL_OPTIONS[currentActiveZone.id].length} models
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ZONE_MODEL_OPTIONS[currentActiveZone.id].map((opt) => {
                            const isChosen = formModelId === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelectModel(opt)}
                                className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 select-none ${
                                  isChosen
                                    ? "border-[#D92C32] bg-red-50/30 shadow-sm ring-1 ring-[#D92C32]/20"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1.5 w-full">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-bold text-gray-950 leading-tight">
                                        {opt.label}
                                      </span>
                                      {opt.tag && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-[#D92C32]">
                                          {opt.tag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10.5px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                                      {opt.sub}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                                      isChosen
                                        ? "bg-[#D92C32] text-white"
                                        : "border-2 border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isChosen && (
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10.5px] w-full">
                                  <span className="text-gray-400 font-medium">
                                    {opt.widthInches}″ Module
                                  </span>
                                  <span
                                    className={`font-bold ${
                                      opt.delta === 0
                                        ? "text-emerald-700"
                                        : "text-[#D92C32]"
                                    }`}
                                  >
                                    {opt.delta === 0
                                      ? "Standard"
                                      : `+${money(opt.delta)}`}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Your Zones ({selectedZoneIds.length})
                      </h3>
                      <span className="text-[10.5px] text-gray-400 font-medium">
                        Click unit in 3D to swap
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {selectedZoneIds.map((id, index) => {
                        const z = ZONES.find((item) => item.id === id)!;
                        const conf = configuredZones[id];
                        const len = conf?.length || z.refLen;
                        const h = (conf?.height || z.heightOptions[0]).replace(" Standard", "");
                        const d = (conf?.depth || z.depthOptions[0]).replace(" Standard", "");
                        const price = getZonePrice(id);
                        const fixtureCount = conf?.fixtures || z.fixtures;

                        return (
                          <div
                            key={id}
                            className="p-2.5 rounded-xl border border-gray-200 bg-white space-y-2"
                          >
                            <div className="flex items-center gap-3">
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
                                {conf?.selectedModelId && (
                                  <p className="text-[11px] text-[#D92C32] font-semibold truncate leading-tight mt-0.5">
                                    {ZONE_MODEL_OPTIONS[id]?.find((m) => m.id === conf.selectedModelId)?.label}
                                  </p>
                                )}
                                <p className="text-[10.5px] text-gray-500 truncate leading-tight mt-0.5">
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

                            {/* Slot Standards chips */}
                            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-1">
                                Slots:
                              </span>
                              {Array.from({ length: fixtureCount }).map((_, slotIdx) => {
                                const swapId = unitSwaps[id]?.[slotIdx];
                                const standards = ZONE_STANDARDS[id] || [];
                                const chosenStd = standards.find((s) => s.id === swapId);
                                const isSlotSelected = false;
                                return (
                                  <button
                                    key={slotIdx}
                                    type="button"
                                    onClick={() => handleUnitClick(id, slotIdx)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${isSlotSelected
                                        ? "bg-[#D92C32] text-white border-transparent shadow-sm"
                                        : chosenStd && chosenStd.delta !== 0
                                          ? "bg-red-50 text-[#D92C32] border-red-200 hover:bg-red-100"
                                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                                      }`}
                                    title="Click to swap this unit in 3D"
                                  >
                                    #{slotIdx + 1} {chosenStd && chosenStd.delta !== 0 ? chosenStd.label.split(" ")[0] : "Std"}
                                  </button>
                                );
                              })}
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
          </>
        )}
      </div>
    </div>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM STATUS & CHECKOUT BAR (Matches Recommended Structure)
         ════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        {/* Left: Active Zone pill with icon & price */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-3.5 py-1.5 rounded-xl">
          <Box className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-900">
            {selectedUnit
              ? `${ZONES.find((z) => z.id === selectedUnit.zoneId)?.label} (Slot #${selectedUnit.unitIndex + 1})`
              : step === 2
              ? currentActiveZone.label
              : `${selectedZoneIds.length} Zones in Store`}
          </span>
          <span className="text-xs font-extrabold text-[#D92C32] ml-1">
            {money(
              selectedUnit
                ? getZonePrice(selectedUnit.zoneId)
                : step === 2
                ? currentZoneEstimate
                : totalPrice
            )}
          </span>
        </div>

        {/* Center: Store Total */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Store Total</span>
          <span className="text-base sm:text-lg font-black text-gray-950">
            {money(totalPrice)}
          </span>
        </div>

        {/* Right: Primary CTA */}
        <div>
          {selectedUnit ? (
            <button
              type="button"
              onClick={() => setSelectedUnit(null)}
              className="h-10 px-5 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Done with Slot #{selectedUnit.unitIndex + 1}</span>
              <Check className="w-4 h-4" />
            </button>
          ) : step === 1 ? (
            <button
              type="button"
              onClick={handleStartConfiguring}
              disabled={selectedZoneIds.length === 0}
              className="h-10 px-5 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Configure {selectedZoneIds.length} Zones</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : step === 2 ? (
            <button
              type="button"
              onClick={() => handleSaveAndContinue()}
              className="h-10 px-5 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>
                {activeZoneIdx < selectedZoneIds.length - 1
                  ? "Next Zone"
                  : "Continue to Review"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-10 px-6 rounded-xl bg-[#D92C32] hover:bg-[#b5252a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
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