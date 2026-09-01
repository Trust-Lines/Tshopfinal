// ── Store Configurator data model ───────────────────────────────
// All 5 supplied GLBs belong to ONE zone (Gondola Shelving) as size
// variants. The other zones are selectable but have no model yet.

export type FinishId = "natural_oak" | "warm_walnut" | "black_pine";

export interface Finish {
  id: FinishId;
  label: string;
  wood: string; // multiplied onto wood ("SONOMA") material
  frame: string; // multiplied onto metal / panel materials
  swatch: string; // CSS gradient for the UI chip
}

export const FINISHES: Finish[] = [
  {
    id: "natural_oak",
    label: "Natural Oak",
    wood: "#c9a271",
    frame: "#2b2f36",
    swatch: "linear-gradient(135deg,#d8b98c,#b98b56)",
  },
  {
    id: "warm_walnut",
    label: "Warm Walnut",
    wood: "#7a4a2b",
    frame: "#26262a",
    swatch: "linear-gradient(135deg,#8a5836,#5c3016)",
  },
  {
    id: "black_pine",
    label: "Matte Black & Pine",
    wood: "#d9c4a0",
    frame: "#161618",
    swatch: "linear-gradient(135deg,#3a3a3d,#111113)",
  },
];

export interface Variant {
  id: string;
  label: string;
  file: string;
  blurb: string;
  /** metres consumed along the run by one bay (tiling step) */
  stepM: number;
  /** rotate the model 90° so its long axis follows the run */
  rotateY: boolean;
  pricePerBay: number;
  thumbTone: string; // small preview block colour
}

export const GONDOLA_VARIANTS: Variant[] = [
  {
    id: "tall-wall",
    label: "Tall Wall Bay",
    file: "/models/zone-1.glb",
    blurb: "2.0 m single-sided perimeter wall unit · 5 shelves",
    stepM: 1.0,
    rotateY: false,
    pricePerBay: 780,
    thumbTone: "#1e2530",
  },
  {
    id: "mid-wall",
    label: "Mid Wall Bay",
    file: "/models/zone-3.glb",
    blurb: "1.45 m single-sided unit · 3 shelves",
    stepM: 1.0,
    rotateY: false,
    pricePerBay: 640,
    thumbTone: "#28303c",
  },
  {
    id: "low-wall",
    label: "Low Display Bay",
    file: "/models/zone-2.glb",
    blurb: "1.0 m low profile unit · 2 angled shelves",
    stepM: 1.0,
    rotateY: false,
    pricePerBay: 520,
    thumbTone: "#323b47",
  },
  {
    id: "island-short",
    label: "Island Run · Short",
    file: "/models/zone-4.glb",
    blurb: "2.5 m double-sided island gondola",
    stepM: 2.49,
    rotateY: true,
    pricePerBay: 1180,
    thumbTone: "#2b3440",
  },
  {
    id: "island-long",
    label: "Island Run · Long",
    file: "/models/zone-5.glb",
    blurb: "3.0 m double-sided island gondola · fully merchandised frame",
    stepM: 2.97,
    rotateY: true,
    pricePerBay: 1420,
    thumbTone: "#242c37",
  },
];

export interface ZoneDef {
  id: string;
  label: string;
  tagline: string;
  hasModel: boolean;
  cartImage: string;
  /** placeholder footprint in metres for zones without a model (w along run, d, h) */
  placeholder?: { w: number; d: number; h: number; stepM: number };
  pricePerBay?: number; // for placeholder zones
  /** default run length in feet */
  defaultLenFt: number;

  // ── stage-flow fields ─────────────────────────────
  kind: "shelf" | "counter";
  /** module width in feet — one unit consumes this much wall */
  mod: number;
  /** base price per unit before config / variant adjustments */
  unitPrice: number;
  desc: string;
  /** allowed heights in inches (first is the standard) */
  heights: number[];
  /** allowed depths in inches (first is the standard) */
  depths: number[];
  /** standard shelf count for one unit */
  shelves: number;
}

export const ZONES: ZoneDef[] = [
  {
    id: "gondola",
    label: "Gondola shelving",
    tagline: "Main aisle & perimeter shelving",
    hasModel: true,
    cartImage: "/gondola_shelving_unit.jpg",
    defaultLenFt: 24,
    kind: "shelf",
    mod: 4,
    unitPrice: 820,
    desc: "Down the aisle",
    heights: [53, 77],
    depths: [12, 16],
    shelves: 5,
  },
  {
    id: "deli",
    label: "Deli counter",
    tagline: "Chilled serve-over counter run",
    hasModel: false,
    cartImage: "/end_cap_display.jpg",
    placeholder: { w: 1.0, d: 0.95, h: 1.25, stepM: 1.22 },
    pricePerBay: 2100,
    defaultLenFt: 12,
    kind: "counter",
    mod: 4,
    unitPrice: 2100,
    desc: "Service and back",
    heights: [36, 42],
    depths: [24, 30],
    shelves: 2,
  },
  {
    id: "coffee",
    label: "Coffee counter",
    tagline: "Self-serve coffee & grab-and-go",
    hasModel: false,
    cartImage: "/coffee_island.jpg",
    placeholder: { w: 1.0, d: 0.9, h: 1.15, stepM: 1.22 },
    pricePerBay: 1750,
    defaultLenFt: 8,
    kind: "counter",
    mod: 4,
    unitPrice: 1750,
    desc: "Brew and condiments",
    heights: [36, 42],
    depths: [24, 30],
    shelves: 2,
  },
  {
    id: "front-checkout",
    label: "Front checkout",
    tagline: "Point-of-sale lanes at the entrance",
    hasModel: false,
    cartImage: "/cashier_counter.jpg",
    placeholder: { w: 1.2, d: 1.0, h: 1.1, stepM: 1.52 },
    pricePerBay: 2400,
    defaultLenFt: 10,
    kind: "counter",
    mod: 5,
    unitPrice: 2400,
    desc: "Register run",
    heights: [36, 42],
    depths: [24, 30],
    shelves: 3,
  },
  {
    id: "back-counter",
    label: "Back counter",
    tagline: "Back-of-house prep & storage counter",
    hasModel: false,
    cartImage: "/cashier_counter.jpg",
    placeholder: { w: 1.0, d: 0.6, h: 1.4, stepM: 1.52 },
    pricePerBay: 1600,
    defaultLenFt: 16,
    kind: "shelf",
    mod: 5,
    unitPrice: 1600,
    desc: "Behind the register",
    heights: [53, 77],
    depths: [12, 16],
    shelves: 4,
  },
];

// ── proposal-step config & per-unit variants ──────────
export interface StageConfig {
  id: string;
  label: string;
  mult: number;
  shelfAdj: number;
  note: string;
}
export const STAGE_CONFIGS: StageConfig[] = [
  { id: "rec", label: "Recommended", mult: 1, shelfAdj: 0, note: "Our standard for this zone." },
  { id: "sto", label: "More storage", mult: 1.14, shelfAdj: 1, note: "Extra shelf per unit, closed backs." },
  { id: "dis", label: "More display", mult: 0.95, shelfAdj: -1, note: "Fewer shelves, open sightlines." },
];

export interface UnitVariant {
  label: string;
  delta: number;
  shelfAdj: number;
}
export const UNIT_VARIANTS: UnitVariant[] = [
  { label: "Standard", delta: 0, shelfAdj: 0 },
  { label: "Closed cabinet", delta: 240, shelfAdj: -1 },
  { label: "Open display", delta: -180, shelfAdj: 1 },
];

/** map a chosen height (inches) to one of the shelving GLB variants */
export function variantIdForHeight(h: number): string {
  if (h >= 70) return "tall-wall";
  if (h >= 44) return "mid-wall";
  return "low-wall";
}

/** price of a single unit given the zone, active config id and variant index */
export function unitPrice(zone: ZoneDef, cfgId: string, variantIndex: number): number {
  const cfg = STAGE_CONFIGS.find((c) => c.id === cfgId) ?? STAGE_CONFIGS[0];
  const v = UNIT_VARIANTS[variantIndex] ?? UNIT_VARIANTS[0];
  return zone.unitPrice * cfg.mult + v.delta * (zone.unitPrice / 1600);
}

/** total for a zone: sum of its units */
export function zoneTotal(
  zone: ZoneDef,
  cfgId: string,
  units: { v: number }[]
): number {
  return units.reduce((a, u) => a + unitPrice(zone, cfgId, u.v), 0);
}

export function unitsForLength(zone: ZoneDef, lengthFt: number): number {
  return Math.max(1, Math.floor(lengthFt / zone.mod));
}

export const FT_PER_M = 3.28084;
export const M_PER_FT = 0.3048;

export interface ZoneSelection {
  lengthFt: number;
  finish: FinishId;
  variantId: string; // only meaningful when the zone has model variants
}

export function defaultSelection(zone: ZoneDef): ZoneSelection {
  return {
    lengthFt: zone.defaultLenFt,
    finish: "natural_oak",
    variantId: GONDOLA_VARIANTS[0].id,
  };
}

export function baysFor(zone: ZoneDef, sel: ZoneSelection): number {
  const stepM = zone.hasModel
    ? (GONDOLA_VARIANTS.find((v) => v.id === sel.variantId) ?? GONDOLA_VARIANTS[0]).stepM
    : zone.placeholder!.stepM;
  const runM = sel.lengthFt * M_PER_FT;
  return Math.max(1, Math.round(runM / stepM));
}

export function pricePerBayFor(zone: ZoneDef, sel: ZoneSelection): number {
  if (zone.hasModel) {
    return (GONDOLA_VARIANTS.find((v) => v.id === sel.variantId) ?? GONDOLA_VARIANTS[0])
      .pricePerBay;
  }
  return zone.pricePerBay!;
}

export function subtotalFor(zone: ZoneDef, sel: ZoneSelection): number {
  return baysFor(zone, sel) * pricePerBayFor(zone, sel);
}
