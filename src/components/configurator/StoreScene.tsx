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

export type SceneView = "front" | "3q" | "top";

export interface SceneRow {
  zone: ZoneDef;
  sel: ZoneSelection;
  /** explicit unit count — overrides the derived bay count */
  bays?: number;
}

const rowBays = (r: SceneRow) => r.bays ?? baysFor(r.zone, r.sel);

const getZoneModelInfo = (r: SceneRow) => {
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
  if (r.zone.id === "deli" || r.zone.id === "front-checkout") {
    return { file: "/models/zone-2.glb", rotateY: false, stepM: 1.0 };
  }
  if (r.zone.id === "coffee") {
    return { file: "/models/zone-4.glb", rotateY: true, stepM: 2.49 };
  }
  if (r.zone.id === "back-counter") {
    return { file: "/models/zone-3.glb", rotateY: false, stepM: 1.0 };
  }
  return { file: "/models/zone-1.glb", rotateY: false, stepM: 1.0 };
};

function StoreContent({
  rows,
  onUnitClick,
  activeUnit,
}: {
  rows: SceneRow[];
  onUnitClick?: (i: number) => void;
  activeUnit?: number | null;
}) {
  const gap = 2.4;
  const laidOut = useMemo(() => {
    const startZ = -((rows.length - 1) * gap) / 2;
    return rows.map((r, i) => ({ ...r, z: startZ + i * gap }));
  }, [rows]);

  const fitKey = laidOut
    .map((r) => r.zone.id + r.sel.variantId + rowBays(r) + r.sel.finish)
    .join("|");

  const interactive = !!onUnitClick;

  return (
    <Center key={fitKey} disableY>
      <group>
        {laidOut.map((r) => {
          const bays = rowBays(r);
          const modelInfo = getZoneModelInfo(r);
          return (
            <ZoneModel
              key={r.zone.id}
              file={modelInfo.file}
              finish={r.sel.finish}
              rotateY={modelInfo.rotateY}
              stepM={modelInfo.stepM}
              bays={bays}
              position={[0, 0, r.z]}
              onUnitClick={interactive ? onUnitClick : undefined}
              activeUnit={interactive ? activeUnit : null}
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
}: {
  maxDim: number;
  view: SceneView;
  dep: string;
}) {
  const { camera, controls } = useThree() as any;
  useEffect(() => {
    // Tight, balanced framing matching reference Photo 2 — store fills ~70-75% of canvas cleanly
    const dist = Math.max(5.6, maxDim * 1.32 + 0.4);
    if (view === "front") {
      camera.position.set(0, dist * 0.35, dist * 1.15);
      if (controls) {
        controls.target.set(0, 0.75, 0);
        controls.update();
      }
    } else if (view === "top") {
      camera.position.set(0.001, dist * 1.45, 0.001);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    } else {
      // "3q" / Angle view matching Photo 2 — centered on the diagonal store footprint
      camera.position.set(dist * 0.62 + 0.5, dist * 0.48, dist * 0.80 + 0.1);
      if (controls) {
        controls.target.set(0.5, 0.75, 0.1);
        controls.update();
      }
    }
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  }, [camera, controls, dep, maxDim, view]);
  return null;
}

interface StoreSceneProps {
  rows: SceneRow[];
  view?: SceneView;
  onUnitClick?: (i: number) => void;
  activeUnit?: number | null;
}

export default function StoreScene({
  rows,
  view = "3q",
  onUnitClick,
  activeUnit = null,
}: StoreSceneProps) {
  const maxDim = useMemo(() => {
    if (!rows || rows.length === 0) return 4;
    let maxW = 3.5;
    for (const r of rows) {
      const info = getZoneModelInfo(r);
      maxW = Math.max(maxW, rowBays(r) * info.stepM);
    }
    const depth = Math.max(2.4, (rows.length - 1) * 2.4 + 1.6);
    return Math.max(maxW, depth);
  }, [rows]);

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
      camera={{ position: [5.6, 4.2, 7.2], fov: 38 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <CameraRig maxDim={maxDim} view={view} dep={dep} />
      <color attach="background" args={["#faf9f7"]} />
      <hemisphereLight args={["#ffffff", "#bbb6ad", 1.2]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <directionalLight position={[-8, 6, -4]} intensity={0.45} />

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
          activeUnit={activeUnit}
        />
      </Suspense>

      {/* Architectural grid floor matching reference */}
      <gridHelper args={[60, 60, "#d4d4d4", "#e8e8e8"]} position={[0, -0.01, 0]} />

      <ContactShadows
        position={[0, 0, 0]}
        scale={28}
        far={7}
        opacity={0.25}
        blur={2.4}
        resolution={1024}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2.0}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate={false}
        target={[0.5, 0.75, 0.1]}
      />
    </Canvas>
  );
}
