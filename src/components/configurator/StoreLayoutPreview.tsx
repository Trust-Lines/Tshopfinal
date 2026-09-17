"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  ChevronDown,
  Move,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
  Pencil,
  FileSpreadsheet,
  Info,
  Check,
  X,
} from "lucide-react";
import type { SceneRow, SceneView } from "./StoreScene";

// Dynamically import StoreScene so Three.js renders on client only
const StoreScene = dynamic(() => import("./StoreScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f9fa] text-gray-400 gap-2 min-h-[300px]">
      <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold">Loading 3D Visualizer…</span>
    </div>
  ),
});

export interface StoreLayoutPreviewProps {
  rows: SceneRow[];
  totalPrice: number;
  totalFixtures: number;
  selectedCount: number;
  onUnitClick?: (zoneId: string, unitIndex: number) => void;
  selectedUnit?: { zoneId: string; unitIndex: number } | null;
  onDeselectUnit?: () => void;
}

export default function StoreLayoutPreview({
  rows,
  totalPrice,
  totalFixtures,
  selectedCount,
  onUnitClick,
  selectedUnit,
  onDeselectUnit,
}: StoreLayoutPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // View state: "perspective" | "top" | "front"
  const [view, setView] = useState<SceneView>("perspective");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Layout spacing state: "seamless" | "compact" | "spaced"
  const [spacingMode, setSpacingMode] = useState<"seamless" | "compact" | "spaced">("seamless");
  const [isSpacingDropdownOpen, setIsSpacingDropdownOpen] = useState(false);

  // Derived aisleGap (in meters)
  const aisleGap = spacingMode === "seamless" ? 0.02 : spacingMode === "compact" ? 0.4 : 1.25;

  // Controls signals
  const [zoomInSignal, setZoomInSignal] = useState(0);
  const [zoomOutSignal, setZoomOutSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [panEnabled, setPanEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Store Size State (defaults to 20 ft x 12 ft matching mockup)
  const [storeSize, setStoreSize] = useState({ widthFt: 20, lengthFt: 12 });
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [tempWidth, setTempWidth] = useState("20");
  const [tempLength, setTempLength] = useState("12");

  // Info tooltip state
  const [showInfo, setShowInfo] = useState(false);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Failed to enter fullscreen", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleSelectView = (v: SceneView) => {
    setView(v);
    setIsDropdownOpen(false);
  };

  const getViewLabel = (v: SceneView) => {
    switch (v) {
      case "perspective":
      case "3q":
        return "Perspective View";
      case "top":
        return "Top View (2D)";
      case "front":
        return "Front Elevation";
      default:
        return "Perspective View";
    }
  };

  const is2D = view === "top";

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-3xl border border-gray-200/90 shadow-2xs flex flex-col h-full overflow-hidden transition-all ${isFullscreen ? "p-6" : "p-4 sm:p-5"
        }`}
    >
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-950 tracking-tight leading-snug">
            3D Layout Preview
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-none mt-0.5">
            Arrange and view your selected fixtures
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Spacing Control Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSpacingDropdownOpen(!isSpacingDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 text-xs font-semibold text-gray-800 transition-all shadow-2xs cursor-pointer"
              title="Fixture Spacing"
            >
              <span className="text-gray-500 font-normal hidden sm:inline">Spacing:</span>
              <span className="capitalize font-bold">{spacingMode}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isSpacingDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isSpacingDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSpacingDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSpacingMode("seamless");
                      setIsSpacingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${spacingMode === "seamless"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Seamless (0 gap)</span>
                    {spacingMode === "seamless" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpacingMode("compact");
                      setIsSpacingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${spacingMode === "compact"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Compact</span>
                    {spacingMode === "compact" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpacingMode("spaced");
                      setIsSpacingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${spacingMode === "spaced"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Aisle Spaced</span>
                    {spacingMode === "spaced" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* View Mode Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 text-xs font-semibold text-gray-800 transition-all shadow-2xs cursor-pointer"
            >
              <Box className="w-4 h-4 text-gray-700" />
              <span>{getViewLabel(view)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectView("perspective")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${view === "perspective" || view === "3q"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Perspective View</span>
                    {(view === "perspective" || view === "3q") && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView("top")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${view === "top"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Top View (2D)</span>
                    {view === "top" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView("front")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${view === "front"
                      ? "text-[#D92C32] font-bold bg-red-50/40"
                      : "text-gray-700 font-medium"
                      }`}
                  >
                    <span>Front Elevation</span>
                    {view === "front" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 3D CANVAS VIEWPORT ── */}
      <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-gray-100 bg-[#f8f9fa]">
        <StoreScene
          rows={rows}
          view={view}
          onUnitClick={onUnitClick}
          selectedUnit={selectedUnit}
          zoomInSignal={zoomInSignal}
          zoomOutSignal={zoomOutSignal}
          resetSignal={resetSignal}
          panEnabled={panEnabled}
          aisleGap={aisleGap}
        />

        {/* Active Unit Overlay Pill (Top Center) */}
        {selectedUnit && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 bg-[#D92C32] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              <span>
                Unit #{selectedUnit.unitIndex + 1} Selected
              </span>
              {onDeselectUnit && (
                <button
                  type="button"
                  onClick={onDeselectUnit}
                  className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer ml-0.5"
                  title="Deselect unit"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── FLOATING TOOLBARS (BOTTOM OF CANVAS) ── */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 flex items-center justify-between pointer-events-none z-20">
          {/* Left Controls Pill */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-gray-200/90 shadow-sm pointer-events-auto">
            {/* Reset / Perspective Preset */}
            <button
              type="button"
              onClick={() => {
                setView("perspective");
                setResetSignal((s) => s + 1);
              }}
              title="Reset View"
              className="p-1.5 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4" />
            </button>

            {/* Pan Mode Toggle */}
            <button
              type="button"
              onClick={() => setPanEnabled(!panEnabled)}
              title={panEnabled ? "Disable Pan Mode" : "Enable Pan Mode"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${panEnabled
                ? "bg-[#D92C32] text-white"
                : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"
                }`}
            >
              <Move className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              type="button"
              onClick={() => setZoomOutSignal((s) => s + 1)}
              title="Zoom Out"
              className="p-1.5 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={() => setZoomInSignal((s) => s + 1)}
              title="Zoom In"
              className="p-1.5 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-3.5 bg-gray-200 mx-0.5" />

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
              className="p-1.5 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right Segmented 2D / 3D Pill */}
          <div className="flex items-center p-1 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-sm pointer-events-auto">
            <button
              type="button"
              onClick={() => handleSelectView("top")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${is2D
                ? "bg-[#D92C32] text-white shadow-2xs"
                : "text-gray-700 hover:text-gray-950"
                }`}
            >
              2D
            </button>
            <button
              type="button"
              onClick={() => handleSelectView("perspective")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${!is2D
                ? "bg-[#D92C32] text-white shadow-2xs"
                : "text-gray-700 hover:text-gray-950"
                }`}
            >
              3D
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS SUMMARY BAR (STICKY FOOTER — always visible) ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 mt-2 bg-gray-50/90 rounded-2xl border border-gray-200/80 shadow-2xs shrink-0 overflow-hidden"
        style={{ minHeight: '72px', maxHeight: '80px' }}
      >
        {/* 1 — Store Size */}
        <div className="flex items-center min-h-[76px] px-6 lg:px-8 py-4">
          <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-4 w-full max-w-[230px] mx-auto">

            <div className="w-10 h-10 rounded-full bg-white border border-gray-200/90 flex items-center justify-center shrink-0 shadow-2xs">
              <svg
                className="w-4 h-4 text-gray-700 stroke-[1.8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
              </svg>
            </div>

            <div className="min-w-0">
              <span className="block text-xs font-semibold text-gray-500 leading-none">
                Store Size
              </span>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-base font-extrabold text-gray-950 leading-tight whitespace-nowrap">
                  {storeSize.widthFt} ft × {storeSize.lengthFt} ft
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setTempWidth(String(storeSize.widthFt));
                    setTempLength(String(storeSize.lengthFt));
                    setIsEditingSize(true);
                  }}
                  className="p-0.5 shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Edit Store Size"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2 — Selected Fixtures */}
        <div className="flex items-center min-h-[76px] px-6 lg:px-8 py-4 border-t sm:border-t-0 sm:border-l border-gray-200">
          <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-4 w-full max-w-[230px] mx-auto">

            <div className="w-10 h-10 rounded-full bg-white border border-gray-200/90 flex items-center justify-center shrink-0 shadow-2xs">
              <Box className="w-4 h-4 text-gray-700 stroke-[1.8]" />
            </div>

            <div className="min-w-0">
              <span className="block text-xs font-semibold text-gray-500 leading-none">
                Selected Fixtures
              </span>

              <span className="block mt-1.5 text-base font-extrabold text-gray-950 leading-tight whitespace-nowrap">
                {selectedCount} item{selectedCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* 3 — Estimated Total */}
        <div className="relative flex items-center min-h-[76px] px-6 lg:px-8 py-4 border-t sm:border-t-0 sm:border-l border-gray-200">
          <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-4 w-full max-w-[230px] mx-auto">

            <div className="w-10 h-10 rounded-full bg-white border border-gray-200/90 flex items-center justify-center shrink-0 shadow-2xs">
              <FileSpreadsheet className="w-4 h-4 text-gray-700 stroke-[1.8]" />
            </div>

            <div className="min-w-0">
              <span className="block text-xs font-semibold text-gray-500 leading-none">
                Estimated Total
              </span>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-base font-extrabold text-gray-950 leading-tight whitespace-nowrap">
                  ${Math.round(totalPrice).toLocaleString()}
                </span>

                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-0.5 shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Pricing Info"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Keep your existing pricing popover here */}
        </div>
      </div>

      {/* ── EDIT STORE SIZE MODAL ── */}
      {isEditingSize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-950">
                Adjust Store Dimensions
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingSize(false)}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Enter your retail space boundary dimensions in feet:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:border-[#D92C32] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Length / Depth (ft)
                </label>
                <input
                  type="number"
                  value={tempLength}
                  onChange={(e) => setTempLength(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:border-[#D92C32] outline-none"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">
                Common Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setTempWidth("20");
                    setTempLength("12");
                  }}
                  className="py-1 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer text-center"
                >
                  20 × 12 ft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempWidth("30");
                    setTempLength("18");
                  }}
                  className="py-1 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer text-center"
                >
                  30 × 18 ft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempWidth("40");
                    setTempLength("24");
                  }}
                  className="py-1 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer text-center"
                >
                  40 × 24 ft
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingSize(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const w = parseInt(tempWidth, 10) || 20;
                  const l = parseInt(tempLength, 10) || 12;
                  setStoreSize({ widthFt: w, lengthFt: l });
                  setIsEditingSize(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white rounded-xl bg-[#D92C32] hover:bg-[#b5252a] cursor-pointer shadow-sm"
              >
                Save Size
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
