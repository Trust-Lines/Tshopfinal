"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import ZoneModel from "./ZoneModel";
import {
  FINISHES,
  GONDOLA_VARIANTS,
  ZoneDef,
  ZoneSelection,
  baysFor,
} from "./config";

export type SceneView = "front" | "3q" | "top";

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

// Store Content: Real Store Floor Plan Layout using only project GLB files
function StoreContent({
  rows,
  onUnitClick,
  selectedUnit,
}: {
  rows: SceneRow[];
  onUnitClick?: (zoneId: string, unitIndex: number) => void;
  selectedUnit?: { zoneId: string; unitIndex: number } | null;
}) {
  const gondolaRow = rows.find((r) => r.zone.id === "gondola") ?? rows[0];
  const deliRow =
    rows.find((r) => r.zone.id === "deli") ??
    rows.find((r) => r.zone.id === "front-checkout") ??
    rows[1] ??
    rows[0];

  const finish = gondolaRow?.sel?.finish ?? "natural_oak";
  const gondolaModelInfo = getZoneModelInfo(gondolaRow || rows[0]);
  const deliModelInfo = getZoneModelInfo(deliRow || rows[0]);

  const deliActiveBay =
    selectedUnit?.zoneId === "deli" ||
    selectedUnit?.zoneId === "front-checkout" ||
    selectedUnit?.zoneId === deliRow?.zone?.id
      ? selectedUnit.unitIndex
      : null;

  const gondolaActiveBay =
    selectedUnit?.zoneId === "gondola" ? selectedUnit.unitIndex : null;

  return (
    <group position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
      {/* ══════════════════════════════════════════════════════
          1. BACK PERIMETER WALL (Facing forward +Z)
         ══════════════════════════════════════════════════════ */}
      <ZoneModel
        file={gondolaModelInfo.file}
        finish={finish}
        rotateY={gondolaModelInfo.rotateY}
        stepM={gondolaModelInfo.stepM}
        bays={4}
        position={[0, 0, -2.1]}
        rowRotationY={0}
        onUnitClick={
          onUnitClick
            ? (bayIdx) => onUnitClick("gondola", bayIdx)
            : undefined
        }
        activeUnit={gondolaActiveBay !== null && gondolaActiveBay < 4 ? gondolaActiveBay : null}
      />

      {/* ══════════════════════════════════════════════════════
          2. LEFT PERIMETER WALL (Facing inward +X)
         ══════════════════════════════════════════════════════ */}
      <ZoneModel
        file={gondolaModelInfo.file}
        finish={finish}
        rotateY={gondolaModelInfo.rotateY}
        stepM={gondolaModelInfo.stepM}
        bays={4}
        position={[-2.25, 0, -0.3]}
        rowRotationY={Math.PI / 2}
        onUnitClick={
          onUnitClick
            ? (bayIdx) => onUnitClick("gondola", bayIdx)
            : undefined
        }
        activeUnit={
          gondolaActiveBay !== null && gondolaActiveBay >= 4 && gondolaActiveBay < 8
            ? gondolaActiveBay - 4
            : null
        }
      />

      {/* ══════════════════════════════════════════════════════
          3. RIGHT PERIMETER WALL (Facing inward -X)
         ══════════════════════════════════════════════════════ */}
      <ZoneModel
        file={gondolaModelInfo.file}
        finish={finish}
        rotateY={gondolaModelInfo.rotateY}
        stepM={gondolaModelInfo.stepM}
        bays={4}
        position={[2.25, 0, -0.3]}
        rowRotationY={-Math.PI / 2}
        onUnitClick={
          onUnitClick
            ? (bayIdx) => onUnitClick("gondola", bayIdx)
            : undefined
        }
        activeUnit={
          gondolaActiveBay !== null && gondolaActiveBay >= 8 && gondolaActiveBay < 12
            ? gondolaActiveBay - 8
            : null
        }
      />

      {/* ══════════════════════════════════════════════════════
          4. CENTRAL GONDOLA ISLAND (Double-sided run in center)
         ══════════════════════════════════════════════════════ */}
      <group position={[0, 0, -0.35]}>
        {/* Front-facing island side */}
        <ZoneModel
          file={gondolaModelInfo.file}
          finish={finish}
          rotateY={gondolaModelInfo.rotateY}
          stepM={gondolaModelInfo.stepM}
          bays={2}
          position={[0, 0, 0.28]}
          rowRotationY={0}
          onUnitClick={
            onUnitClick
              ? (bayIdx) => onUnitClick("gondola", bayIdx)
              : undefined
          }
        />
        {/* Back-facing island side */}
        <ZoneModel
          file={gondolaModelInfo.file}
          finish={finish}
          rotateY={gondolaModelInfo.rotateY}
          stepM={gondolaModelInfo.stepM}
          bays={2}
          position={[0, 0, -0.28]}
          rowRotationY={Math.PI}
          onUnitClick={
            onUnitClick
              ? (bayIdx) => onUnitClick("gondola", bayIdx)
              : undefined
          }
        />
      </group>

      {/* ══════════════════════════════════════════════════════
          5. FRONT SERVICE / DELI COUNTER RUN (Slots 1, 2, 3, 4)
         ══════════════════════════════════════════════════════ */}
      <group position={[-0.45, 0, 1.65]}>
        <ZoneModel
          file={deliModelInfo.file}
          finish={finish}
          rotateY={deliModelInfo.rotateY}
          stepM={deliModelInfo.stepM || 1.0}
          bays={deliRow?.bays ?? 4}
          position={[0, 0, 0]}
          rowRotationY={0}
          bayFiles={deliRow?.bayFiles}
          zoneId={deliRow?.zone?.id ?? "deli"}
          onUnitClick={
            onUnitClick
              ? (bayIdx) => onUnitClick(deliRow?.zone?.id ?? "deli", bayIdx)
              : undefined
          }
          activeUnit={deliActiveBay}
        />

        {/* Tall end corner display tower on the right of counter */}
        <group position={[((deliRow?.bays ?? 4) * (deliModelInfo.stepM || 1.0)) / 2 + 0.12, 0, 0]}>
          <ZoneModel
            file="/models/zone-3.glb"
            finish={finish}
            rotateY={false}
            stepM={0.65}
            bays={1}
            position={[0, 0, 0]}
            rowRotationY={-Math.PI / 2}
          />
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════
          6. FRONT-RIGHT ENTRANCEWAY
          (Open walkway between counter and right wall)
         ══════════════════════════════════════════════════════ */}
      <mesh position={[1.65, 0.001, 1.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 0.8]} />
        <meshBasicMaterial color="#e7e5e4" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Camera Rig matching the heroic 3/4 isometric perspective in reference screenshot
function CameraRig({
  maxDim,
  view,
  dep,
}: {
  maxDim: number;
  view: SceneView;
  dep: string;
}) {
  const { camera, controls } = useThree() as any;

  useEffect(() => {
    const dist = 6.2;
    if (view === "front") {
      camera.position.set(0, 3.4, 7.2);
      if (controls) {
        controls.target.set(0, 0.65, 0);
        controls.update();
      }
    } else if (view === "top") {
      camera.position.set(0.001, 8.4, 0.001);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    } else {
      // "3q" / Angle view — heroic isometric perspective matching the reference screenshot
      camera.position.set(0, 5.0, 7.5);
      if (controls) {
        controls.target.set(0, 0.65, 0);
        controls.update();
      }
    }
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  }, [camera, controls, dep, maxDim, view]);

  return null;
}

export interface StoreSceneProps {
  rows: SceneRow[];
  view?: SceneView;
  onUnitClick?: (zoneId: string, unitIndex: number) => void;
  selectedUnit?: { zoneId: string; unitIndex: number } | null;
}

export default function StoreScene({
  rows,
  view = "3q",
  onUnitClick,
  selectedUnit = null,
}: StoreSceneProps) {
  const maxDim = useMemo(() => {
    if (!rows || rows.length === 0) return 4;
    let maxW = 3.0;
    for (const r of rows) {
      const info = getZoneModelInfo(r);
      maxW = Math.max(maxW, rowBays(r) * info.stepM);
    }
    const depth = Math.max(2.0, (rows.length - 1) * 1.85 + 1.2);
    return Math.max(maxW, depth);
  }, [rows]);

  const dep = (rows || [])
    .map((r) => r.zone.id + r.sel.variantId + rowBays(r) + JSON.stringify(r.bayFiles || {}))
    .join("|");

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 5.0, 7.5], fov: 36 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <CameraRig maxDim={maxDim} view={view} dep={dep} />
      <color attach="background" args={["#faf9f7"]} />
      <hemisphereLight args={["#ffffff", "#bbb6ad", 1.25]} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
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
        />
      </Suspense>

      {/* Architectural subtle floor grid */}
      <gridHelper args={[24, 24, "#e5e3df", "#f0eee9"]} position={[0, -0.01, 0]} />

      <ContactShadows
        position={[0, 0, 0]}
        scale={20}
        far={5}
        opacity={0.28}
        blur={2.0}
        resolution={1024}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate={false}
        target={[0, 0.65, 0]}
      />
    </Canvas>
  );
}
