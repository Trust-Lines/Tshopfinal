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

function PlaceholderRow({
  zone,
  sel,
  bays,
  z,
  onUnitClick,
  activeUnit,
}: {
  zone: ZoneDef;
  sel: ZoneSelection;
  bays: number;
  z: number;
  onUnitClick?: (i: number) => void;
  activeUnit?: number | null;
}) {
  const ph = zone.placeholder!;
  const finish = FINISHES.find((f) => f.id === sel.finish) ?? FINISHES[0];
  const span = (bays - 1) * ph.stepM;

  return (
    <group position={[0, 0, z]}>
      {Array.from({ length: bays }).map((_, i) => {
        const x = i * ph.stepM - span / 2;
        const on = activeUnit === i;
        return (
          <group
            key={i}
            position={[x, 0, 0]}
            onClick={
              onUnitClick
                ? (e) => {
                    e.stopPropagation();
                    onUnitClick(i);
                  }
                : undefined
            }
            onPointerOver={
              onUnitClick
                ? (e) => {
                    e.stopPropagation();
                    document.body.style.cursor = "pointer";
                  }
                : undefined
            }
            onPointerOut={
              onUnitClick
                ? () => {
                    document.body.style.cursor = "auto";
                  }
                : undefined
            }
          >
            <mesh castShadow receiveShadow position={[0, ph.h * 0.45, 0]}>
              <boxGeometry args={[ph.w * 0.96, ph.h * 0.9, ph.d]} />
              <meshStandardMaterial
                color={finish.frame}
                roughness={0.6}
                metalness={0.15}
                transparent
                opacity={0.6}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, ph.h * 0.92, 0]}>
              <boxGeometry args={[ph.w, ph.h * 0.08, ph.d * 1.08]} />
              <meshStandardMaterial color={finish.wood} roughness={0.7} />
            </mesh>
            {on && (
              <mesh position={[0, ph.h * 0.5, 0]}>
                <boxGeometry args={[ph.w * 1.05, ph.h * 1.02, ph.d * 1.14]} />
                <meshBasicMaterial color="#B5352E" wireframe />
              </mesh>
            )}
          </group>
        );
      })}
      <Html position={[0, ph.h + 0.95, 0]} center distanceFactor={9}>
        <div
          style={{
            whiteSpace: "nowrap",
            fontSize: 11,
            fontWeight: 600,
            color: "#17181A",
            background: "rgba(255,255,255,.92)",
            border: "1px solid #E5E3E0",
            borderRadius: 6,
            padding: "3px 9px",
          }}
        >
          {zone.label} · model soon
        </div>
      </Html>
    </group>
  );
}

function StoreContent({
  rows,
  onUnitClick,
  activeUnit,
}: {
  rows: SceneRow[];
  onUnitClick?: (i: number) => void;
  activeUnit?: number | null;
}) {
  const gap = 3.1;
  const laidOut = useMemo(() => {
    const startZ = -((rows.length - 1) * gap) / 2;
    return rows.map((r, i) => ({ ...r, z: startZ + i * gap }));
  }, [rows]);

  const fitKey = laidOut
    .map((r) => r.zone.id + r.sel.variantId + rowBays(r) + r.sel.finish)
    .join("|");

  const interactive = rows.length === 1; // proposal step shows one zone

  return (
    <Center key={fitKey} disableY>
      <group>
        {laidOut.map((r) => {
          const bays = rowBays(r);
          if (r.zone.hasModel) {
            const v =
              GONDOLA_VARIANTS.find((x) => x.id === r.sel.variantId) ??
              GONDOLA_VARIANTS[0];
            return (
              <ZoneModel
                key={r.zone.id}
                file={v.file}
                finish={r.sel.finish}
                rotateY={v.rotateY}
                stepM={v.stepM}
                bays={bays}
                position={[0, 0, r.z]}
                onUnitClick={interactive ? onUnitClick : undefined}
                activeUnit={interactive ? activeUnit : null}
              />
            );
          }
          return (
            <PlaceholderRow
              key={r.zone.id}
              zone={r.zone}
              sel={r.sel}
              bays={bays}
              z={r.z}
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
  radius,
  view,
  dep,
}: {
  radius: number;
  view: SceneView;
  dep: string;
}) {
  const { camera, controls } = useThree() as any;
  useEffect(() => {
    const d = radius * 1.0 + 1.1;
    if (view === "front") camera.position.set(0, d * 0.3, d * 1.2);
    else if (view === "top") camera.position.set(0.001, d * 1.6, 0.001);
    else camera.position.set(d * 0.85, d * 0.44, d * 0.95);
    camera.near = 0.1;
    camera.far = d * 10;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.set(0, view === "top" ? 0 : 0.9, 0);
      controls.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, radius, view]);
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
  const radius = useMemo(() => {
    let maxW = 4;
    for (const r of rows) {
      const stepM = r.zone.hasModel
        ? GONDOLA_VARIANTS.find((v) => v.id === r.sel.variantId)?.stepM ?? 1
        : r.zone.placeholder!.stepM;
      maxW = Math.max(maxW, rowBays(r) * stepM);
    }
    const depth = Math.max(3, (rows.length - 1) * 3.1 + 2);
    return Math.max(maxW, depth) * 0.44 + 1.3;
  }, [rows]);

  const dep = rows
    .map((r) => r.zone.id + r.sel.variantId + rowBays(r))
    .join("|");

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [10, 8, 14], fov: 42 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <CameraRig radius={radius} view={view} dep={dep} />
      <color attach="background" args={["#f7f6f4"]} />
      <hemisphereLight args={["#ffffff", "#bbb6ad", 1.15]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.0}
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

      <ContactShadows
        position={[0, 0, 0]}
        scale={20}
        far={7}
        opacity={0.32}
        blur={2.4}
        resolution={1024}
      />
      <gridHelper
        args={[26, 26, "#d9d6d1", "#e9e7e3"]}
        position={[0, -0.001, 0]}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3}
        maxDistance={90}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={view === "3q"}
        autoRotateSpeed={0.35}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}
