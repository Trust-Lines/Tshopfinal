"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Center, Html } from "@react-three/drei";
import ZoneModel from "./ZoneModel";
import {
  FINISHES,
  GONDOLA_VARIANTS,
  ZoneDef,
  ZoneSelection,
  baysFor,
} from "./config";

export type SceneView = "front" | "3q" | "top" | "perspective";

export interface SceneRow {
  zone: ZoneDef;
  sel: ZoneSelection;
  /** explicit unit count — overrides the derived bay count */
  bays?: number;
  bayFiles?: Record<number, string>;
  modelFile?: string;
  stepM?: number;
}

const rowBays = (r: SceneRow) => r.bays ?? baysFor(r.zone, r.sel);

const getZoneModelInfo = (r: SceneRow) => {
  if (r.modelFile) {
    return {
      file: r.modelFile,
      rotateY: r.zone.rotateY ?? false,
      stepM: r.stepM ?? r.zone.stepM ?? 1.0,
    };
  }
  if (r.zone.id === "gondola") {
    const v =
      GONDOLA_VARIANTS.find((x) => x.id === r.sel.variantId) ??
      GONDOLA_VARIANTS[0];
    return {
      file: v.file,
      rotateY: v.rotateY,
      stepM: v.stepM,
    };
  }
  if (r.zone.modelFile) {
    return {
      file: r.zone.modelFile,
      rotateY: r.zone.rotateY ?? false,
      stepM: r.zone.stepM ?? 1.0,
    };
  }
  if (r.zone.id === "front-checkout") {
    return { file: "/models/cashier/sc-sliding-34.glb", rotateY: false, stepM: 0.91 };
  }
  if (r.zone.id === "back-counter") {
    return { file: "/models/cashier/bc-36.glb", rotateY: false, stepM: 0.97 };
  }
  if (r.zone.id === "deli") {
    return { file: "/models/zone-2.glb", rotateY: false, stepM: 1.0 };
  }
  if (r.zone.id === "coffee") {
    return { file: "/models/coffee/fa-40.glb", rotateY: false, stepM: 1.02 };
  }
  if (r.zone.id === "countertop") {
    return { file: "/models/cashier/countertop-showcase-34.glb", rotateY: false, stepM: 0.86 };
  }
  if (r.zone.id === "jewellery") {
    return { file: "/models/cashier/sc-hinged-34.glb", rotateY: false, stepM: 0.90 };
  }
  return { file: "/models/zone-1.glb", rotateY: false, stepM: 1.0 };
};

function StoreContent({
  rows,
  onUnitClick,
  selectedUnit,
  aisleGap = 0.02,
}: {
  rows: SceneRow[];
  onUnitClick?: (zoneId: string, unitIndex: number) => void;
  selectedUnit?: { zoneId: string; unitIndex: number } | null;
  aisleGap?: number;
}) {
  const laidOut = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const n = rows.length;
    if (n === 1) {
      return [{ ...rows[0], x: 0, z: 0, rowRotationY: 0 }];
    }

    // Measure width of each run
    const widths = rows.map((r) => {
      const info = getZoneModelInfo(r);
      return rowBays(r) * info.stepM;
    });

    const totalSpan =
      widths.reduce((acc, w) => acc + w, 0) + (n - 1) * aisleGap;
    let currentLeft = -totalSpan / 2;

    return rows.map((r, i) => {
      const w = widths[i];
      const x = currentLeft + w / 2;
      currentLeft += w + aisleGap;

      // In the mockup, all fixtures face forward (towards user/camera) side-by-side
      const rowRotationY = 0;
      const z = 0;

      return {
        ...r,
        x,
        z,
        rowRotationY,
      };
    });
  }, [rows, aisleGap]);

  const fitKey = laidOut
    .map(
      (r) =>
        r.zone.id +
        r.sel.variantId +
        rowBays(r) +
        r.sel.finish +
        (r.modelFile || "") +
        JSON.stringify(r.bayFiles || {})
    )
    .join("|");

  return (
    <Center key={fitKey} disableY>
      <group>
        {laidOut.map((r) => {
          const bays = rowBays(r);
          const modelInfo = getZoneModelInfo(r);
          const activeBay =
            selectedUnit?.zoneId === r.zone.id ? selectedUnit.unitIndex : null;

          return (
            <ZoneModel
              key={r.zone.id}
              file={modelInfo.file}
              finish={r.sel.finish}
              rotateY={modelInfo.rotateY}
              stepM={modelInfo.stepM}
              bays={bays}
              position={[r.x, 0, r.z]}
              rowRotationY={r.rowRotationY}
              bayFiles={r.bayFiles}
              onUnitClick={
                onUnitClick
                  ? (bayIdx) => onUnitClick(r.zone.id, bayIdx)
                  : undefined
              }
              activeUnit={activeBay}
            />
          );
        })}
      </group>
    </Center>
  );
}

function CameraRig({
  maxDim,
  view,
  dep,
  zoomInSignal,
  zoomOutSignal,
  resetSignal,
}: {
  maxDim: number;
  view: SceneView;
  dep: string;
  zoomInSignal?: number;
  zoomOutSignal?: number;
  resetSignal?: number;
}) {
  const { camera, controls } = useThree() as any;

  useEffect(() => {
    // Framing matching user mockup: store fills ~45-55% of canvas with full floor grid perspective
    const dist = Math.max(7.5, maxDim * 1.1 + 1.8);
    if (view === "front") {
      camera.position.set(0, dist * 0.35, dist * 1.15);
      if (controls) {
        controls.target.set(0, 0.75, 0);
        controls.update();
      }
    } else if (view === "top") {
      camera.position.set(0.001, dist * 1.35, 0.001);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    } else {
      // "3q" / "perspective" — Heroic view showing floor grid and depth of all fixtures
      camera.position.set(dist * 0.08, dist * 0.44, dist * 1.05);
      if (controls) {
        controls.target.set(0, 0.65, 0);
        controls.update();
      }
    }
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  }, [camera, controls, dep, maxDim, view]);

  // Handle Zoom In
  useEffect(() => {
    if (!zoomInSignal || !controls) return;
    const target = controls.target;
    if (!target) return;
    camera.position.lerp(target, 0.2);
    controls.update();
  }, [zoomInSignal, camera, controls]);

  // Handle Zoom Out
  useEffect(() => {
    if (!zoomOutSignal || !controls) return;
    const target = controls.target;
    if (!target) return;
    const dir = camera.position.clone().sub(target);
    dir.multiplyScalar(1.22);
    camera.position.copy(target).add(dir);
    controls.update();
  }, [zoomOutSignal, camera, controls]);

  // Handle Reset View
  useEffect(() => {
    if (!resetSignal || !controls) return;
    const dist = Math.max(8.5, maxDim * 1.05 + 2.2);
    camera.position.set(dist * 0.08, dist * 0.44, dist * 1.05);
    controls.target.set(0, 0.65, 0);
    controls.update();
  }, [resetSignal, camera, controls, maxDim]);

  return null;
}

export interface StoreSceneProps {
  rows: SceneRow[];
  view?: SceneView;
  onUnitClick?: (zoneId: string, unitIndex: number) => void;
  selectedUnit?: { zoneId: string; unitIndex: number } | null;
  zoomInSignal?: number;
  zoomOutSignal?: number;
  resetSignal?: number;
  panEnabled?: boolean;
  aisleGap?: number;
}

export default function StoreScene({
  rows,
  view = "perspective",
  onUnitClick,
  selectedUnit = null,
  zoomInSignal,
  zoomOutSignal,
  resetSignal,
  panEnabled = false,
  aisleGap = 0.02,
}: StoreSceneProps) {
  const maxDim = useMemo(() => {
    if (!rows || rows.length === 0) return 4;
    let sumW = 0;
    let maxRowW = 2.0;
    for (const r of rows) {
      const info = getZoneModelInfo(r);
      const w = rowBays(r) * info.stepM;
      sumW += w;
      maxRowW = Math.max(maxRowW, w);
    }
    const horizontalWidth = sumW + Math.max(0, rows.length - 1) * aisleGap;
    return Math.max(horizontalWidth, maxRowW, 4.0);
  }, [rows, aisleGap]);

  const dep = (rows || [])
    .map((r) => r.zone.id + r.sel.variantId + rowBays(r))
    .join("|");

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.0, 4.5, 7.8], fov: 36 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <CameraRig
        maxDim={maxDim}
        view={view}
        dep={dep}
        zoomInSignal={zoomInSignal}
        zoomOutSignal={zoomOutSignal}
        resetSignal={resetSignal}
      />
      <color attach="background" args={["#f8f9fa"]} />
      <hemisphereLight args={["#ffffff", "#bbb6ad", 1.25]} />
      <directionalLight
        position={[7, 12, 7]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <directionalLight position={[-8, 6, -4]} intensity={0.5} />

      <Suspense
        fallback={
          <Html center>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#93969B" }}>
              Building your store…
            </div>
          </Html>
        }
      >
        <StoreContent
          rows={rows}
          onUnitClick={onUnitClick}
          selectedUnit={selectedUnit}
          aisleGap={aisleGap}
        />
      </Suspense>

      {/* Subtle floor grid matching mockup */}
      <gridHelper
        args={[28, 28, "#dcdfe4", "#eef0f4"]}
        position={[0, -0.01, 0]}
      />

      <ContactShadows
        position={[0, 0, 0]}
        scale={26}
        far={6}
        opacity={0.3}
        blur={2.2}
        resolution={1024}
      />

      <OrbitControls
        makeDefault
        enablePan={panEnabled}
        minDistance={1.5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={false}
        target={[0, 0.65, 0]}
      />
    </Canvas>
  );
}
