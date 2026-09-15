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

export interface StoreType {
  id: string;
  name: string;
  sub: string;
  desc: string;
}

export const STORE_TYPES: StoreType[] = [
  {
    id: "cstore",
    name: "C-Store",
    sub: "Convenience retail",
    desc: "Optimized for quick trips, high-margin impulse items, and high customer turnover.",
  },
  {
    id: "grocery",
    name: "Grocery Store",
    sub: "Food retail",
    desc: "Designed for full-basket weekly trips, high-density aisle shelving, and fresh food prep.",
  },
  {
    id: "truck",
    name: "Truck Stop",
    sub: "Travel retail",
    desc: "Built for heavy foot traffic, combined travel essentials, fast-food counters, and grab-and-go.",
  },
  {
    id: "jewellery",
    name: "Jewellery Store",
    sub: "Luxury boutique",
    desc: "Designed for high-end boutique vitrines, lockable glass showcases, and consultation counters.",
  },
];

export interface ZoneDef {
  id: string;
  label: string;
  tagline: string;
  subLabel: string;
  hasModel: boolean;
  modelFile?: string;
  stepM?: number;
  rotateY?: boolean;
  cartImage: string;
  /** placeholder footprint in metres for zones without a model (w along run, d, h) */
  placeholder?: { w: number; d: number; h: number; stepM: number };
  pricePerBay?: number; // for placeholder zones
  /** default run length in feet */
  defaultLenFt: number;
  refLen: number;
  basePrice: number;
  fixtures: number;
  heightOptions: string[];
  depthOptions: string[];

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
    label: "Gondola Shelving",
    tagline: "Core products & everyday essentials",
    subLabel: "Aisles & shelving",
    hasModel: true,
    modelFile: "/models/zone-1.glb",
    stepM: 1.0,
    rotateY: false,
    cartImage: "/gondola_shelving_unit.jpg",
    defaultLenFt: 20,
    refLen: 20,
    basePrice: 3280,
    fixtures: 6,
    heightOptions: ["53″ Standard", "77″ Standard"],
    depthOptions: ["12″ Standard", "16″ Standard"],
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
    label: "Deli Counter",
    tagline: "Service & fresh food for customer attraction.",
    subLabel: "Service & fresh food",
    hasModel: true,
    modelFile: "/models/zone-2.glb",
    stepM: 1.0,
    rotateY: false,
    cartImage: "/end_cap_display.jpg",
    placeholder: { w: 1.0, d: 0.95, h: 1.25, stepM: 1.22 },
    pricePerBay: 2100,
    defaultLenFt: 14,
    refLen: 14,
    basePrice: 2858,
    fixtures: 4,
    heightOptions: ["36″ Standard", "42″ Standard"],
    depthOptions: ["24″ Standard", "30″ Standard"],
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
    label: "Coffee Counter",
    tagline: "Beverages, snacks & grab-and-go",
    subLabel: "Brew & condiments",
    hasModel: true,
    modelFile: "/models/coffee/fa-40.glb",
    stepM: 1.02,
    rotateY: false,
    cartImage: "/coffee_island.jpg",
    placeholder: { w: 1.0, d: 0.9, h: 1.15, stepM: 1.02 },
    pricePerBay: 1750,
    defaultLenFt: 10,
    refLen: 10,
    basePrice: 2240,
    fixtures: 4,
    heightOptions: ["36″ Standard", "42″ Standard"],
    depthOptions: ["24″ Standard", "30″ Standard"],
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
    label: "Front Checkout",
    tagline: "Primary customer checkout area",
    subLabel: "Register area",
    hasModel: true,
    modelFile: "/models/cashier/sc-sliding-34.glb",
    stepM: 0.91,
    rotateY: false,
    cartImage: "/cashier_counter.jpg",
    placeholder: { w: 0.91, d: 0.6, h: 2.47, stepM: 0.91 },
    pricePerBay: 2120,
    defaultLenFt: 12,
    refLen: 12,
    basePrice: 2640,
    fixtures: 4,
    heightOptions: ["34″ Showcase", "48″ Showcase"],
    depthOptions: ["24″ Standard", "30″ Standard"],
    kind: "counter",
    mod: 3,
    unitPrice: 2120,
    desc: "Register run",
    heights: [34, 48],
    depths: [24, 30],
    shelves: 3,
  },
  {
    id: "back-counter",
    label: "Back Counter",
    tagline: "Staff workspace & storage",
    subLabel: "Behind register",
    hasModel: true,
    modelFile: "/models/cashier/bc-36.glb",
    stepM: 0.97,
    rotateY: false,
    cartImage: "/wall_display_unit.jpg",
    placeholder: { w: 0.97, d: 0.52, h: 2.45, stepM: 0.97 },
    pricePerBay: 1650,
    defaultLenFt: 10,
    refLen: 10,
    basePrice: 1572,
    fixtures: 3,
    heightOptions: ["36″ Standard", "48″ Standard"],
    depthOptions: ["24″ Standard", "30″ Standard"],
    kind: "shelf",
    mod: 3,
    unitPrice: 1650,
    desc: "Behind the register",
    heights: [36, 48],
    depths: [24, 30],
    shelves: 4,
  },
  {
    id: "countertop",
    label: "Countertop Merchandising",
    tagline: "Showcases & display risers for cash counters",
    subLabel: "Countertop displays",
    hasModel: true,
    modelFile: "/models/cashier/countertop-showcase-34.glb",
    stepM: 0.86,
    rotateY: false,
    cartImage: "/cashier_counter.jpg",
    placeholder: { w: 0.86, d: 0.55, h: 1.1, stepM: 0.86 },
    pricePerBay: 480,
    defaultLenFt: 8,
    refLen: 8,
    basePrice: 1420,
    fixtures: 3,
    heightOptions: ["30″ Standard", "34″ Showcase", "36″ Extended"],
    depthOptions: ["18″ Standard", "24″ Extended"],
    kind: "counter",
    mod: 3,
    unitPrice: 480,
    desc: "Tiered glass display risers and countertop showcases",
    heights: [30, 34, 36],
    depths: [18, 24],
    shelves: 2,
  },
  {
    id: "jewellery",
    label: "Jewellery Showcases",
    tagline: "Tempered glass vitrines & luxury display counters",
    subLabel: "Jewellery & boutique",
    hasModel: true,
    modelFile: "/models/cashier/sc-hinged-34.glb",
    stepM: 0.90,
    rotateY: false,
    cartImage: "/store_type_jewellery.jpg",
    placeholder: { w: 0.90, d: 0.65, h: 1.25, stepM: 0.90 },
    pricePerBay: 910,
    defaultLenFt: 12,
    refLen: 12,
    basePrice: 3650,
    fixtures: 4,
    heightOptions: ["34″ Showcase", "48″ Showcase"],
    depthOptions: ["24″ Standard", "30″ Standard"],
    kind: "counter",
    mod: 3,
    unitPrice: 910,
    desc: "Illuminated glass boutique counters and display pedestals",
    heights: [34, 48],
    depths: [24, 30],
    shelves: 3,
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

export interface ModelOption {
  id: string;
  label: string;
  sub: string;
  file: string;
  stepM: number;
  delta: number;
  widthInches: number;
  tag?: string;
}

export const ZONE_MODEL_OPTIONS: Record<string, ModelOption[]> = {
  "front-checkout": [
    {
      id: "sc-sliding-34",
      label: "Sliding Glass Showcase 34″",
      sub: "Smooth sliding glass doors with enclosed lower storage",
      file: "/models/cashier/sc-sliding-34.glb",
      stepM: 0.91,
      delta: 0,
      widthInches: 34,
      tag: "Popular",
    },
    {
      id: "sc-sliding-48",
      label: "Sliding Glass Showcase 48″",
      sub: "Wide 48″ sliding glass showcase for maximum merchandising",
      file: "/models/cashier/sc-sliding-48.glb",
      stepM: 1.27,
      delta: 220,
      widthInches: 48,
    },
    {
      id: "sc-hinged-34",
      label: "Hinged Glass Showcase 34″",
      sub: "Front-opening lockable hinged showcase with shelf lights",
      file: "/models/cashier/sc-hinged-34.glb",
      stepM: 0.90,
      delta: 140,
      widthInches: 34,
    },
    {
      id: "sc-hinged-48",
      label: "Hinged Glass Showcase 48″",
      sub: "Wide 48″ front-opening lockable hinged glass showcase",
      file: "/models/cashier/sc-hinged-48.glb",
      stepM: 1.27,
      delta: 360,
      widthInches: 48,
    },
    {
      id: "sc-cigar-34",
      label: "Cigar & Tobacco Display 34″",
      sub: "Specialized angled tobacco & premium product merchandiser",
      file: "/models/cashier/sc-cigar-display-34.glb",
      stepM: 0.91,
      delta: 260,
      widthInches: 34,
      tag: "Premium",
    },
    {
      id: "sc-cigar-48",
      label: "Cigar & Tobacco Display 48″",
      sub: "Wide 48″ humidor & premium product display showcase",
      file: "/models/cashier/sc-cigar-display-48.glb",
      stepM: 1.27,
      delta: 480,
      widthInches: 48,
    },
    {
      id: "swing-door-1",
      label: "Cashier Access Swing Door 1",
      sub: "Gravity hinge staff security access barrier door",
      file: "/models/cashier/swing-door-1.glb",
      stepM: 0.91,
      delta: -120,
      widthInches: 36,
      tag: "Swing Door",
    },
    {
      id: "swing-door-2",
      label: "Cashier Access Swing Door 2",
      sub: "Counter security barrier swing gate door",
      file: "/models/cashier/swing-door-2.glb",
      stepM: 0.91,
      delta: -120,
      widthInches: 36,
      tag: "Swing Door",
    },
  ],
  "back-counter": [
    {
      id: "bc-36",
      label: "Backcashier Cabinet 36″ (BC-36)",
      sub: "Lockable base cabinet with tall upper display backboard",
      file: "/models/cashier/bc-36.glb",
      stepM: 0.97,
      delta: 0,
      widthInches: 36,
      tag: "Standard",
    },
    {
      id: "bc-48",
      label: "Backcashier Cabinet 48″ (BC-48)",
      sub: "Wide 48″ lockable storage cabinet & upper shelving frame",
      file: "/models/cashier/bc-48.glb",
      stepM: 1.27,
      delta: 240,
      widthInches: 48,
    },
    {
      id: "swing-door-1",
      label: "Cashier Access Swing Door 1",
      sub: "Gravity-action stainless & acrylic staff access barrier door",
      file: "/models/cashier/swing-door-1.glb",
      stepM: 0.91,
      delta: -120,
      widthInches: 36,
      tag: "Swing Door",
    },
    {
      id: "swing-door-2",
      label: "Cashier Access Swing Door 2",
      sub: "Counter security barrier swing gate door",
      file: "/models/cashier/swing-door-2.glb",
      stepM: 0.91,
      delta: -120,
      widthInches: 36,
      tag: "Swing Door",
    },
  ],
  gondola: [
    {
      id: "tall-wall",
      label: "Tall Wall Bay (77″)",
      sub: "2.0 m single-sided perimeter wall unit · 5 shelves",
      file: "/models/zone-1.glb",
      stepM: 1.0,
      delta: 0,
      widthInches: 40,
      tag: "Standard",
    },
    {
      id: "mid-wall",
      label: "Mid Wall Bay (53″)",
      sub: "1.45 m single-sided perimeter unit · 3 shelves",
      file: "/models/zone-3.glb",
      stepM: 1.0,
      delta: -140,
      widthInches: 40,
    },
    {
      id: "low-wall",
      label: "Low Display Bay (36″)",
      sub: "1.0 m low profile unit · 2 angled shelves",
      file: "/models/zone-2.glb",
      stepM: 1.0,
      delta: -260,
      widthInches: 40,
    },
    {
      id: "island-short",
      label: "Island Run · Short",
      sub: "2.5 m double-sided center-aisle gondola",
      file: "/models/zone-4.glb",
      stepM: 2.49,
      delta: 360,
      widthInches: 98,
    },
    {
      id: "island-long",
      label: "Island Run · Long",
      sub: "3.0 m double-sided center-aisle gondola",
      file: "/models/zone-5.glb",
      stepM: 2.97,
      delta: 600,
      widthInches: 117,
    },
    {
      id: "endcap-35",
      label: "Merchandising Endcap 35″",
      sub: "Aisle-end feature display fixture",
      file: "/models/shelving/Endcap-35.glb",
      stepM: 0.89,
      delta: 220,
      widthInches: 35,
      tag: "Endcap",
    },
  ],
  coffee: [
    {
      id: "fa-40",
      label: "Coffee Counter 40″ (FA-40)",
      sub: "Full-width beverage counter with storage",
      file: "/models/coffee/fa-40.glb",
      stepM: 1.02,
      delta: 0,
      widthInches: 40,
      tag: "Standard",
    },
    {
      id: "fa-40t",
      label: "Coffee Tower Station 40″ (FA-40T)",
      sub: "High-capacity overhead tower & canopy",
      file: "/models/coffee/fa-40t.glb",
      stepM: 1.02,
      delta: 280,
      widthInches: 40,
      tag: "Tower",
    },
    {
      id: "fa-40-c",
      label: "Condiment & Dispenser Station 40″ (FA-40-C)",
      sub: "Organized drop-in wells and syrup organizers",
      file: "/models/coffee/fa-40-c.glb",
      stepM: 1.02,
      delta: 160,
      widthInches: 40,
    },
    {
      id: "fa-40-m",
      label: "Microwave & Food Island 40″ (FA-40-M)",
      sub: "Quick-serve heated food & appliance station",
      file: "/models/coffee/fa-40-m.glb",
      stepM: 1.02,
      delta: 190,
      widthInches: 40,
    },
    {
      id: "fa-20",
      label: "Compact Coffee Station 20″ (FA-20)",
      sub: "Narrow 20″ footprint beverage module",
      file: "/models/coffee/fa-20.glb",
      stepM: 0.51,
      delta: -150,
      widthInches: 20,
    },
    {
      id: "fa-20t",
      label: "Compact Tower Station 20″ (FA-20T / F20T)",
      sub: "20″ vertical space-saver tower unit with overhead display",
      file: "/models/coffee/fa-20t.glb",
      stepM: 0.51,
      delta: 90,
      widthInches: 20,
    },
  ],
  countertop: [
    {
      id: "ct-showcase-34",
      label: "Countertop Showcase 34″",
      sub: "Tiered tempered glass showcase for counter merchandising",
      file: "/models/cashier/countertop-showcase-34.glb",
      stepM: 0.86,
      delta: 0,
      widthInches: 34,
      tag: "Standard",
    },
    {
      id: "ct-showcase-30",
      label: "Countertop Showcase 30″",
      sub: "Compact 30″ glass countertop display case",
      file: "/models/cashier/countertop-showcase-30.glb",
      stepM: 0.76,
      delta: -60,
      widthInches: 30,
    },
    {
      id: "ct-showcase-36",
      label: "Countertop Showcase 36″",
      sub: "36″ tempered glass counter showcase section",
      file: "/models/cashier/countertop-showcase-36.glb",
      stepM: 0.91,
      delta: 80,
      widthInches: 36,
    },
    {
      id: "ct-showcase-48",
      label: "Countertop Showcase 48″",
      sub: "Wide 48″ tempered counter showcase",
      file: "/models/cashier/countertop-showcase-48.glb",
      stepM: 1.22,
      delta: 190,
      widthInches: 48,
    },
    {
      id: "ct-shelves-24",
      label: "Countertop Shelves 24″",
      sub: "24″ tiered counter accessories shelf riser",
      file: "/models/cashier/countertop-shelves-24.glb",
      stepM: 0.61,
      delta: -110,
      widthInches: 24,
    },
  ],
  jewellery: [
    {
      id: "jw-hinged-34",
      label: "Luxury Hinged Showcase 34″",
      sub: "Lockable tempered glass vitrine counter",
      file: "/models/cashier/sc-hinged-34.glb",
      stepM: 0.90,
      delta: 0,
      widthInches: 34,
      tag: "Popular",
    },
    {
      id: "jw-hinged-48",
      label: "Luxury Hinged Showcase 48″",
      sub: "Wide 48″ illuminated jewelry showcase counter",
      file: "/models/cashier/sc-hinged-48.glb",
      stepM: 1.27,
      delta: 220,
      widthInches: 48,
    },
    {
      id: "jw-sliding-34",
      label: "Sliding Boutique Showcase 34″",
      sub: "Rear-access sliding glass boutique counter",
      file: "/models/cashier/sc-sliding-34.glb",
      stepM: 0.91,
      delta: -80,
      widthInches: 34,
    },
    {
      id: "jw-sliding-48",
      label: "Sliding Boutique Showcase 48″",
      sub: "Wide 48″ rear-sliding glass jewelry counter",
      file: "/models/cashier/sc-sliding-48.glb",
      stepM: 1.27,
      delta: 140,
      widthInches: 48,
    },
    {
      id: "jw-cigar-34",
      label: "Display Pedestal Showcase 34″",
      sub: "Angled high-visibility boutique display",
      file: "/models/cashier/sc-cigar-display-34.glb",
      stepM: 0.91,
      delta: 120,
      widthInches: 34,
    },
    {
      id: "swing-door-1",
      label: "Boutique Security Swing Door",
      sub: "Staff access counter swing door barrier",
      file: "/models/cashier/swing-door-1.glb",
      stepM: 0.91,
      delta: -240,
      widthInches: 36,
      tag: "Swing Door",
    },
  ],
};

// ── Step 5: Single Unit Slot Standards (3–4 max per zone) ───────
export interface SlotStandard {
  id: string;
  label: string;
  sub: string;
  delta: number; // price adjustment
  modelFile?: string; // 3D model swap
}

export const ZONE_STANDARDS: Record<string, SlotStandard[]> = {
  gondola: [
    {
      id: "std-wall",
      label: "Standard Wall Shelving",
      sub: "5 full steel shelves · Standard height",
      delta: 0,
      modelFile: "/models/zone-1.glb",
    },
    {
      id: "mid-display",
      label: "Mid-Height Display Bay",
      sub: "3 open display shelves · Direct grab sightlines",
      delta: -140,
      modelFile: "/models/zone-3.glb",
    },
    {
      id: "low-feature",
      label: "Low Feature Bay",
      sub: "2 angled display decks · Endcap impulse",
      delta: -260,
      modelFile: "/models/zone-2.glb",
    },
    {
      id: "endcap-unit",
      label: "Promotional Endcap 35″",
      sub: "Aisle-end feature merchandising fixture",
      delta: 220,
      modelFile: "/models/shelving/Endcap-35.glb",
    },
  ],
  deli: [
    {
      id: "std-service",
      label: "Standard Service Counter",
      sub: "Solid surface counter with lower storage",
      delta: 0,
      modelFile: "/models/zone-2.glb",
    },
    {
      id: "refrig-dropin",
      label: "Refrigerated Grab & Go Bay",
      sub: "Integrated cold display well with front glass",
      delta: 380,
      modelFile: "/models/zone-2.glb",
    },
    {
      id: "prep-station",
      label: "Prep & Slicer Station",
      sub: "Stainless food-grade prep top & power well",
      delta: 190,
      modelFile: "/models/zone-2.glb",
    },
    {
      id: "sneeze-guard",
      label: "Full-Glass Sneeze Guard Bay",
      sub: "Curved tempered sneeze guard with LED light",
      delta: 140,
      modelFile: "/models/zone-2.glb",
    },
  ],
  coffee: [
    {
      id: "std-brewer",
      label: "Standard Brewer Station (FA-40)",
      sub: "Heavy-duty counter with plumbing pass-through",
      delta: 0,
      modelFile: "/models/coffee/fa-40.glb",
    },
    {
      id: "fa-20t",
      label: "Compact Tower Station 20″ (FA-20T / F20T)",
      sub: "20″ vertical space-saver tower unit with overhead display",
      delta: 90,
      modelFile: "/models/coffee/fa-20t.glb",
    },
    {
      id: "fa-20",
      label: "Compact Coffee Station 20″ (FA-20)",
      sub: "Narrow 20″ footprint beverage module",
      delta: -150,
      modelFile: "/models/coffee/fa-20.glb",
    },
    {
      id: "tower-station",
      label: "High-Capacity Tower Station 40″ (FA-40T)",
      sub: "Full-height overhead canopy & storage tower",
      delta: 280,
      modelFile: "/models/coffee/fa-40t.glb",
    },
    {
      id: "condiment-bar",
      label: "Condiment & Syrup Station (FA-40-C)",
      sub: "Built-in cup/lid organizers & drop-in wells",
      delta: 160,
      modelFile: "/models/coffee/fa-40-c.glb",
    },
    {
      id: "microwave-bar",
      label: "Microwave & Food Station (FA-40-M)",
      sub: "Quick-serve heated food & appliance station",
      delta: 190,
      modelFile: "/models/coffee/fa-40-m.glb",
    },
  ],
  "front-checkout": [
    {
      id: "sc-sliding-34",
      label: "Sliding Glass Showcase 34″",
      sub: "Smooth sliding glass doors & showcase deck",
      delta: 0,
      modelFile: "/models/cashier/sc-sliding-34.glb",
    },
    {
      id: "sc-sliding-48",
      label: "Sliding Glass Showcase 48″",
      sub: "Extended 48″ width sliding showcase unit",
      delta: 220,
      modelFile: "/models/cashier/sc-sliding-48.glb",
    },
    {
      id: "sc-hinged-34",
      label: "Hinged Glass Showcase 34″",
      sub: "Front opening hinged security showcase",
      delta: 140,
      modelFile: "/models/cashier/sc-hinged-34.glb",
    },
    {
      id: "sc-hinged-48",
      label: "Hinged Glass Showcase 48″",
      sub: "Wide 48″ front opening hinged security showcase",
      delta: 360,
      modelFile: "/models/cashier/sc-hinged-48.glb",
    },
    {
      id: "sc-cigar-34",
      label: "Cigar & Tobacco Display 34″",
      sub: "Specialized premium tobacco merchandiser case",
      delta: 260,
      modelFile: "/models/cashier/sc-cigar-display-34.glb",
    },
    {
      id: "sc-cigar-48",
      label: "Cigar & Tobacco Display 48″",
      sub: "Wide 48″ premium humidor & tobacco case",
      delta: 480,
      modelFile: "/models/cashier/sc-cigar-display-48.glb",
    },
    {
      id: "swing-door-1",
      label: "Staff Access Swing Door 1",
      sub: "Gravity hinge staff security access barrier door",
      delta: -120,
      modelFile: "/models/cashier/swing-door-1.glb",
    },
    {
      id: "swing-door-2",
      label: "Staff Access Swing Door 2",
      sub: "Counter security barrier swing gate door",
      delta: -120,
      modelFile: "/models/cashier/swing-door-2.glb",
    },
  ],
  "back-counter": [
    {
      id: "bc-36",
      label: "Backcashier Cabinet 36″ (BC-36)",
      sub: "36″ lockable base cabinet with upper display backboard",
      delta: 0,
      modelFile: "/models/cashier/bc-36.glb",
    },
    {
      id: "bc-48",
      label: "Backcashier Cabinet 48″ (BC-48)",
      sub: "Wide 48″ lockable storage cabinet & upper shelving frame",
      delta: 240,
      modelFile: "/models/cashier/bc-48.glb",
    },
    {
      id: "swing-door-1",
      label: "Cashier Access Swing Door 1",
      sub: "Gravity hinge staff security access barrier door",
      delta: -120,
      modelFile: "/models/cashier/swing-door-1.glb",
    },
    {
      id: "swing-door-2",
      label: "Cashier Access Swing Door 2",
      sub: "Counter security barrier swing gate door",
      delta: -120,
      modelFile: "/models/cashier/swing-door-2.glb",
    },
  ],
  countertop: [
    {
      id: "ct-showcase-34",
      label: "Countertop Showcase 34″",
      sub: "Tiered tempered glass showcase for counter merchandising",
      delta: 0,
      modelFile: "/models/cashier/countertop-showcase-34.glb",
    },
    {
      id: "ct-showcase-30",
      label: "Countertop Showcase 30″",
      sub: "Compact 30″ glass countertop display case",
      delta: -60,
      modelFile: "/models/cashier/countertop-showcase-30.glb",
    },
    {
      id: "ct-showcase-36",
      label: "Countertop Showcase 36″",
      sub: "36″ tempered glass counter showcase section",
      delta: 80,
      modelFile: "/models/cashier/countertop-showcase-36.glb",
    },
    {
      id: "ct-showcase-48",
      label: "Countertop Showcase 48″",
      sub: "Wide 48″ tempered counter showcase",
      delta: 190,
      modelFile: "/models/cashier/countertop-showcase-48.glb",
    },
    {
      id: "ct-shelves-24",
      label: "Countertop Shelves 24″",
      sub: "24″ tiered counter accessories shelf riser",
      delta: -110,
      modelFile: "/models/cashier/countertop-shelves-24.glb",
    },
  ],
  jewellery: [
    {
      id: "jw-hinged-34",
      label: "Luxury Hinged Showcase 34″",
      sub: "Lockable tempered glass vitrine counter",
      delta: 0,
      modelFile: "/models/cashier/sc-hinged-34.glb",
    },
    {
      id: "jw-hinged-48",
      label: "Luxury Hinged Showcase 48″",
      sub: "Wide 48″ illuminated jewelry showcase counter",
      delta: 220,
      modelFile: "/models/cashier/sc-hinged-48.glb",
    },
    {
      id: "jw-sliding-34",
      label: "Sliding Boutique Showcase 34″",
      sub: "Rear-access sliding glass boutique counter",
      delta: -80,
      modelFile: "/models/cashier/sc-sliding-34.glb",
    },
    {
      id: "jw-ct-34",
      label: "Countertop Vitrine Riser 34″",
      sub: "Tiered counter showcase display unit",
      delta: -140,
      modelFile: "/models/cashier/countertop-showcase-34.glb",
    },
    {
      id: "swing-door-1",
      label: "Boutique Security Swing Door",
      sub: "Staff access counter swing barrier door",
      delta: -240,
      modelFile: "/models/cashier/swing-door-1.glb",
    },
  ],
};
