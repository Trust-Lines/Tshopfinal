"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import { useCart } from "@/components/cart/CartContext";
import { CFG_CSS } from "./cfgStyles";
import type { SceneView } from "./StoreScene";
import {
  ZONES,
  ZoneDef,
  STAGE_CONFIGS,
  UNIT_VARIANTS,
  variantIdForHeight,
  zoneTotal,
} from "./config";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-sora" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-inter" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

const StoreScene = dynamic(() => import("./StoreScene"), {
  ssr: false,
  loading: () => (
    <div className="empty">
      <div>Loading 3D engine…</div>
    </div>
  ),
});

type Screen =
  | "industry"
  | "zone"
  | "dims"
  | "proposal"
  | "store"
  | "order"
  | "done";

interface StoreEntry {
  zoneId: string;
  len: number;
  h: number;
  d: number;
  cfg: string;
  units: { v: number }[];
  total: number;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const ft = (v: number) => {
  if (!isFinite(v)) return "0 ft";
  const f = Math.floor(v + 1e-9);
  const i = Math.round((v - f) * 12);
  return i ? `${f} ft ${i} in` : `${f} ft`;
};

const INDUSTRIES: [string, string, string][] = [
  ["cstore", "Convenience store", "5 zones ready"],
  ["grocery", "Grocery store", "Coming soon"],
  ["truck", "Truck stop", "Coming soon"],
];

export default function ConfiguratorFlow() {
  const { addBundle, openCart } = useCart();

  const [screen, setScreen] = useState<Screen>("industry");
  const [industry, setIndustry] = useState<string | null>(null);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [len, setLen] = useState("");
  const [h, setH] = useState<number | null>(null);
  const [d, setD] = useState<number | null>(null);
  const [cfg, setCfg] = useState("rec");
  const [units, setUnits] = useState<{ v: number }[]>([]);
  const [swap, setSwap] = useState<number | null>(null);
  const [view, setView] = useState<SceneView>("3q");
  const [store, setStore] = useState<StoreEntry[]>([]);
  const [err, setErr] = useState("");

  const zone: ZoneDef | null = useMemo(
    () => ZONES.find((z) => z.id === zoneId) ?? null,
    [zoneId]
  );

  const zoneTotalNow = zone ? zoneTotal(zone, cfg, units) : 0;
  const storeTotal = store.reduce((a, s) => a + s.total, 0);
  const storeUnits = store.reduce((a, s) => a + s.units.length, 0);

  const go = (s: Screen) => {
    setSwap(null);
    setScreen(s);
  };

  const pickZone = (id: string) => {
    const z = ZONES.find((x) => x.id === id)!;
    const ex = store.find((s) => s.zoneId === id);
    setZoneId(id);
    setLen(ex ? String(ex.len) : "");
    setH(ex ? ex.h : z.heights[0]);
    setD(ex ? ex.d : z.depths[0]);
    setCfg(ex ? ex.cfg : "rec");
    setUnits([]);
    setErr("");
    setSwap(null);
    setScreen("dims");
  };

  const submitDims = () => {
    if (!zone) return;
    const v = parseFloat(len);
    if (!v || v <= 0) {
      setErr("Enter the length of your wall in feet.");
      return;
    }
    if (v < zone.mod || v > 80) {
      setErr(
        "That's outside our standard range. Let's talk — we'll take your details and sort it out."
      );
      return;
    }
    setErr("");
    const n = Math.floor(v / zone.mod);
    setUnits(Array.from({ length: n }, () => ({ v: 0 })));
    go("proposal");
  };

  const addZone = () => {
    if (!zone) return;
    const entry: StoreEntry = {
      zoneId: zone.id,
      len: parseFloat(len),
      h: h ?? zone.heights[0],
      d: d ?? zone.depths[0],
      cfg,
      units: units.map((u) => ({ ...u })),
      total: zoneTotal(zone, cfg, units),
    };
    setStore((prev) => {
      const next = prev.filter((s) => s.zoneId !== zone.id).concat(entry);
      next.sort(
        (a, b) =>
          ZONES.findIndex((z) => z.id === a.zoneId) -
          ZONES.findIndex((z) => z.id === b.zoneId)
      );
      return next;
    });
    setUnits([]);
    go("store");
  };

  const placeOrder = () => {
    const items = store.map((e, i) => {
      const z = ZONES.find((x) => x.id === e.zoneId)!;
      const cfgLabel =
        STAGE_CONFIGS.find((c) => c.id === e.cfg)?.label ?? "Recommended";
      return {
        id: `cfg-${e.zoneId}-${Date.now()}-${i}`,
        title: `${z.label} — ${e.units.length} units · ${cfgLabel} · ${e.h}in`,
        price: Math.round(e.total),
        image: z.cartImage,
        quantity: 1,
      };
    });
    addBundle(items, { open: false });
    go("done");
  };

  const reset = () => {
    setScreen("industry");
    setIndustry(null);
    setZoneId(null);
    setLen("");
    setH(null);
    setD(null);
    setCfg("rec");
    setUnits([]);
    setSwap(null);
    setView("3q");
    setStore([]);
    setErr("");
  };

  // ── scene rows ────────────────────────────────────
  const rows = useMemo(() => {
    const toRow = (
      zId: string,
      lengthFt: number,
      hh: number,
      bays: number
    ) => {
      const z = ZONES.find((x) => x.id === zId)!;
      return {
        zone: z,
        sel: {
          lengthFt,
          finish: "natural_oak" as const,
          variantId: variantIdForHeight(hh),
        },
        bays,
      };
    };
    if (screen === "proposal" && zone && units.length) {
      return [toRow(zone.id, parseFloat(len) || zone.defaultLenFt, h ?? zone.heights[0], units.length)];
    }
    if (["store", "order", "done"].includes(screen)) {
      return store.map((e) => toRow(e.zoneId, e.len, e.h, e.units.length));
    }
    return [];
  }, [screen, zone, units, store, len, h]);

  const emptyMsg = !industry
    ? "Pick your store type to begin"
    : !zoneId
    ? "Pick a zone to begin"
    : "Enter your wall length";

  // ── step rail ─────────────────────────────────────
  const railIdx = { industry: 0, zone: 1, dims: 2, proposal: 2, store: 3, order: 3, done: 3 }[
    screen
  ];

  const inZone = units.length > 0 && screen === "proposal";
  const caption =
    screen === "proposal"
      ? "Drag to orbit · tap a unit to swap it · nothing is dragged into place"
      : store.length
      ? `${store.length} zone${store.length > 1 ? "s" : ""} in your store`
      : "Your layout builds itself as you answer";

  const thumb = (z: ZoneDef, on: boolean) => {
    const c = on ? "#2C313A" : "#C9C7C3";
    const o = on ? "#C0813E" : "#DED9D2";
    return (
      <svg width="100%" height="44" viewBox="0 0 120 44">
        {[0, 1, 2].map((i) => {
          const x = 14 + i * 32;
          const counter = z.kind === "counter";
          return (
            <g key={i}>
              <rect
                x={x}
                y={counter ? 22 : 8}
                width={24}
                height={counter ? 12 : 26}
                fill={c}
                rx={1}
              />
              <rect x={x} y={34} width={24} height={5} fill={o} />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className={`tscfg ${sora.variable} ${inter.variable} ${mono.variable}`}>
      <style>{CFG_CSS}</style>

      {/* sub top bar */}
      <div className="top">
        <div className="brand">
          <b>Build your store</b>
          <span>Start your project</span>
        </div>
        <div className="steps">
          {["Project", "Zone", "Size", "Review"].map((l, i) => (
            <div
              key={l}
              className={`pill ${i === railIdx ? "on" : ""} ${
                i < railIdx ? "done" : ""
              }`}
            >
              <i>{i < railIdx ? "✓" : i + 1}</i>
              {l}
            </div>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className="stage">
          {/* canvas */}
          <div className="canvas">
            <div className="float tl">
              {(["front", "3q", "top"] as SceneView[]).map((v) => (
                <button
                  key={v}
                  className={`tool ${view === v ? "on" : ""}`}
                  onClick={() => setView(v)}
                >
                  {v === "front" ? "Front" : v === "3q" ? "Angle" : "Top"}
                </button>
              ))}
            </div>
            <div className="float tr">

            </div>

            {rows.length ? (
              <div className="scene">
                <StoreScene
                  rows={rows}
                  view={view}
                  onUnitClick={
                    screen === "proposal" ? (i) => setSwap(i) : undefined
                  }
                  activeUnit={swap}
                />
              </div>
            ) : (
              <div className="empty">
                <div>{emptyMsg}</div>
              </div>
            )}
            <div className="caption">{caption}</div>
          </div>

          {/* dark bar */}
          <div className="bar">
            <div>
              <span className="k">
                {inZone ? "Units in this zone" : "Zones in your store"}
              </span>
              <span className="v">{inZone ? units.length : store.length}</span>
            </div>
            <div>
              <span className="k">{inZone ? "Your wall" : "Units placed"}</span>
              <span className="v">
                {inZone ? ft(parseFloat(len)) : storeUnits}
              </span>
            </div>
            <div className="right">
              <span className="k">Estimated total</span>
              <span className="v">
                {money(inZone ? zoneTotalNow : storeTotal)}
              </span>
            </div>
          </div>

          {/* zone strip */}
          <div className="strip">
            <h3>Your store — Contemporary</h3>
            <p>
              Grey with Sonoma oak. Add the zones you need — you can stop any
              time.
            </p>
            <div className="cards">
              {!industry ? (
                <p style={{ fontSize: 12, color: "var(--ink3)", margin: 0 }}>
                  Pick your store type first.
                </p>
              ) : (
                ZONES.map((z) => {
                  const e = store.find((s) => s.zoneId === z.id);
                  const cur = zoneId === z.id && screen !== "store";
                  return (
                    <button
                      key={z.id}
                      className={`zcard ${e ? "done" : ""} ${cur ? "cur" : ""}`}
                      onClick={() => pickZone(z.id)}
                    >
                      <div className="th">{thumb(z, !!e)}</div>
                      <b>{z.label}</b>
                      {e ? (
                        <small>
                          {ft(e.len)} · {money(e.total)}
                        </small>
                      ) : (
                        <span className="go">add →</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* panel */}
        <div className="panel">
          {screen === "industry" && (
            <>
              <h2>What kind of store?</h2>
              <p className="hint">
                This decides which zones we show you next.
              </p>
              {INDUSTRIES.map(([id, l, s]) => (
                <button
                  key={id}
                  className={`opt ${industry === id ? "sel" : ""}`}
                  disabled={id !== "cstore"}
                  onClick={() => setIndustry(id)}
                >
                  <div>
                    <b>{l}</b>
                    <small>{s}</small>
                  </div>
                  <div className="dot" />
                </button>
              ))}
              <button
                className="btn"
                style={{ marginTop: 6 }}
                disabled={!industry}
                onClick={() => go("zone")}
              >
                Continue
              </button>
            </>
          )}

          {screen === "zone" && (
            <>
              <button className="back" onClick={() => go("industry")}>
                ← Store type
              </button>
              <h2>Which zone?</h2>
              <p className="hint">
                Do one at a time. You can add the rest after.
              </p>
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  className="opt"
                  onClick={() => pickZone(z.id)}
                >
                  <div>
                    <b>{z.label}</b>
                    <small>
                      {store.some((s) => s.zoneId === z.id)
                        ? "In your store — reconfigure"
                        : z.desc}
                    </small>
                  </div>
                  <div className="dot" />
                </button>
              ))}
              {store.length > 0 && (
                <button
                  className="btn ghost"
                  style={{ marginTop: 6 }}
                  onClick={() => go("store")}
                >
                  Review my store ({store.length})
                </button>
              )}
            </>
          )}

          {screen === "dims" && zone && (
            <>
              <button className="back" onClick={() => go("zone")}>
                ← Zones
              </button>
              <h2>{zone.label}</h2>
              <p className="hint">
                Measure the wall this zone runs along. We&apos;ll work out the
                rest.
              </p>
              <div className="fld">
                <label>Length of your wall</label>
                <div className="box key">
                  <input
                    inputMode="decimal"
                    placeholder="20"
                    value={len}
                    onChange={(e) => setLen(e.target.value)}
                  />
                  <span className="unit">ft</span>
                </div>
              </div>
              <div className={`err ${err ? "show" : ""}`}>{err}</div>
              <div className="pair">
                <div className="fld">
                  <label>Height</label>
                  <select
                    value={h ?? zone.heights[0]}
                    onChange={(e) => setH(parseInt(e.target.value))}
                  >
                    {zone.heights.map((v) => (
                      <option key={v} value={v}>
                        {v} in
                      </option>
                    ))}
                  </select>
                </div>
                <div className="fld">
                  <label>Depth</label>
                  <select
                    value={d ?? zone.depths[0]}
                    onChange={(e) => setD(parseInt(e.target.value))}
                  >
                    {zone.depths.map((v) => (
                      <option key={v} value={v}>
                        {v} in
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="hint" style={{ margin: "2px 0 12px" }}>
                Already set to our standard — change them only if your space
                needs it.
              </p>
              <button className="btn" onClick={submitDims}>
                Show me what I need
              </button>
            </>
          )}

          {screen === "proposal" && zone && swap !== null && (
            <>
              <button className="back" onClick={() => setSwap(null)}>
                ← Back
              </button>
              <h2>
                Unit {swap + 1} of {units.length}
              </h2>
              <p className="hint">
                Swap it for another standard in this zone. It stays where it is.
              </p>
              {UNIT_VARIANTS.map((v, i) => (
                <button
                  key={v.label}
                  className={`opt ${units[swap]?.v === i ? "sel" : ""}`}
                  onClick={() =>
                    setUnits((u) =>
                      u.map((x, j) => (j === swap ? { v: i } : x))
                    )
                  }
                >
                  <div>
                    <b>{v.label}</b>
                    <small>
                      {v.delta === 0
                        ? "Included"
                        : (v.delta > 0 ? "+" : "−") +
                          money(Math.abs((v.delta * zone.unitPrice) / 1600))}
                    </small>
                  </div>
                  <div className="dot" />
                </button>
              ))}
              <button
                className="btn"
                style={{ marginTop: 6 }}
                onClick={() => setSwap(null)}
              >
                Done
              </button>
            </>
          )}

          {screen === "proposal" && zone && swap === null && (
            <>
              <button className="back" onClick={() => go("dims")}>
                ← Change size
              </button>
              <h2>{zone.label}</h2>
              <p className="hint">
                {units.length} units fill {ft(units.length * zone.mod)} of your{" "}
                {ft(parseFloat(len))} wall. Height {h} in, depth {d} in.
              </p>
              <div className="cfgs">
                {STAGE_CONFIGS.map((c) => {
                  const rec = zone.unitPrice * units.length;
                  const delta = zone.unitPrice * c.mult * units.length - rec;
                  return (
                    <button
                      key={c.id}
                      className={`cfg ${cfg === c.id ? "sel" : ""}`}
                      onClick={() => {
                        setCfg(c.id);
                        setSwap(null);
                      }}
                    >
                      <b>{c.label}</b>
                      <small>
                        {c.id === "rec"
                          ? money(rec)
                          : (delta > 0 ? "+" : "−") + money(Math.abs(delta))}
                      </small>
                    </button>
                  );
                })}
              </div>
              <p className="hint" style={{ marginBottom: 10 }}>
                {STAGE_CONFIGS.find((c) => c.id === cfg)?.note} Tap any unit in
                the view to swap it.
              </p>
              <div className="chips">
                {units.map((u, i) => (
                  <button
                    key={i}
                    className={`chip ${swap === i ? "sel" : ""}`}
                    onClick={() => setSwap(i)}
                  >
                    Unit {i + 1}
                    {u.v ? ` · ${UNIT_VARIANTS[u.v].label}` : ""}
                  </button>
                ))}
              </div>
              <button className="btn" onClick={addZone}>
                Add to my store
              </button>
              <button
                className="btn link"
                onClick={() =>
                  alert(
                    "We'll take your details and have someone come back to you."
                  )
                }
              >
                Need something different?
              </button>
            </>
          )}

          {screen === "store" && (
            <>
              <h2>Your store</h2>
              <p className="hint">
                Everything in one design language. Our team confirms the final
                price with you.
              </p>
              {ZONES.map((z) => {
                const e = store.find((s) => s.zoneId === z.id);
                return e ? (
                  <div className="row" key={z.id}>
                    <span>
                      <span className="check">✓</span>
                      {z.label}
                      <button
                        className="edit"
                        onClick={() => pickZone(z.id)}
                      >
                        edit
                      </button>
                    </span>
                    <span>{money(e.total)}</span>
                  </div>
                ) : (
                  <div className="row" key={z.id}>
                    <span className="mute">{z.label}</span>
                    <button className="add" onClick={() => pickZone(z.id)}>
                      add →
                    </button>
                  </div>
                );
              })}
              <div className="tot">
                <span className="mute">Store total</span>
                <span className="v">{money(storeTotal)}</span>
              </div>
              <p className="note">estimated · nothing is charged now</p>
              <button
                className="btn"
                style={{ marginTop: 12 }}
                disabled={!store.length}
                onClick={() => go("order")}
              >
                Place order
              </button>
            </>
          )}

          {screen === "order" && (
            <>
              <button className="back" onClick={() => go("store")}>
                ← My store
              </button>
              <h2>Place your order</h2>
              <p className="hint">
                {store.length} zone{store.length > 1 ? "s" : ""} ·{" "}
                {money(storeTotal)} estimated. Our team will confirm everything
                before anything ships.
              </p>
              {[
                ["Your name", "Sam Reyes"],
                ["Business name", "Reyes Market"],
                ["Email", "sam@reyesmarket.com"],
                ["Phone", "(214) 555-0148"],
                ["Store address", "1180 Harwood St, Dallas TX"],
              ].map(([l, p]) => (
                <div className="fld" key={l}>
                  <label>{l}</label>
                  <div className="box">
                    <input placeholder={p} />
                  </div>
                </div>
              ))}
              <button className="btn" onClick={placeOrder}>
                Place order
              </button>
              <p className="note">No payment now.</p>
            </>
          )}

          {screen === "done" && (
            <>
              <div style={{ textAlign: "center" }}>
                <div className="done-ico">✓</div>
                <h2>Order received</h2>
                <p className="hint" style={{ margin: "6px 0 14px" }}>
                  Our team will contact you to confirm your order, lead time and
                  delivery. We&apos;ve emailed you a copy with your layout.
                </p>
              </div>
              <div className="row">
                <span className="mute">Order</span>
                <span style={{ fontFamily: "var(--fm)" }}>TS-1042</span>
              </div>
              <div className="row">
                <span className="mute">Zones</span>
                <span style={{ fontFamily: "var(--fm)" }}>{store.length}</span>
              </div>
              <div className="row" style={{ borderBottom: "1px solid var(--line)" }}>
                <span className="mute">Estimated total</span>
                <span style={{ fontFamily: "var(--fm)" }}>
                  {money(storeTotal)}
                </span>
              </div>
              <button
                className="btn"
                style={{ marginTop: 14 }}
                onClick={() => openCart()}
              >
                View cart
              </button>
              <button className="btn link" onClick={reset}>
                Start again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
