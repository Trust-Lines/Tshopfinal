"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Clone } from "@react-three/drei";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { FINISHES, FinishId } from "./config";

// Structural materials of the shelving kit. Anything else (imported
// "<auto>" props, loose merchandise) is stripped so shelves render empty.
const KEEP = /SONOMA|ANTRASIT|Seamed|Steel|Matte|Glass|Leather|Concrete/i;
const WOOD = /SONOMA/i;
const FRAME = /ANTRASIT|Seamed|Steel|Matte/i;

function processScene(
  src: THREE.Object3D,
  finishId: FinishId,
  rotateY: boolean,
  file: string = ""
) {
  const root = skeletonClone(src);
  if (rotateY) root.rotation.y = Math.PI / 2;

  const isGondola = !file || file.includes("/zone-");
  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];
  const remove: THREE.Object3D[] = [];

  const clean = (m: THREE.Material) => {
    const c = (m as THREE.MeshStandardMaterial).clone();
    c.vertexColors = false;
    if (c.emissive) c.emissive.set(0x000000);
    if ("emissiveMap" in c) c.emissiveMap = null;
    if ("emissiveIntensity" in c) c.emissiveIntensity = 0;

    if (WOOD.test(c.name)) {
      c.color = new THREE.Color(finish.wood);
      c.roughness = 0.78;
      c.metalness = 0.0;
    } else if (FRAME.test(c.name)) {
      c.color = new THREE.Color(finish.frame);
      c.metalness = 0.35;
      c.roughness = 0.5;
    } else if (/Glass/i.test(c.name)) {
      c.transparent = true;
      c.opacity = Math.min(c.opacity ?? 1, 0.35);
    } else if (isGondola) {
      // shelf surfaces / misc → plain brushed-metal look (kills the
      // noisy baked texture that ships on the Leather material)
      c.map = null;
      c.color = new THREE.Color("#9aa0a8");
      c.roughness = 0.55;
      c.metalness = 0.25;
    }
    c.needsUpdate = true;
    return c;
  };

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const name = mats.map((m) => m?.name ?? "").join(" ");

    if (isGondola && (!KEEP.test(name) || mesh.geometry.getAttribute("color"))) {
      remove.push(mesh);
      return;
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(clean)
      : clean(mesh.material);
  });

  remove.forEach((m) => m.parent?.remove(m));

  // recentre: footprint centred on origin, base on the floor (y = 0)
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const wrapper = new THREE.Group();
  root.position.set(-center.x, -box.min.y, -center.z);
  wrapper.add(root);
  return { wrapper, size };
}

export interface ZoneModelProps {
  file: string;
  finish: FinishId;
  rotateY: boolean;
  stepM: number;
  bays: number;
  position?: [number, number, number];
  rowRotationY?: number;
  onUnitClick?: (i: number) => void;
  activeUnit?: number | null;
  bayFiles?: Record<number, string>;
}

function BayUnitMesh({
  file,
  finish,
  rotateY,
}: {
  file: string;
  finish: FinishId;
  rotateY: boolean;
}) {
  const { scene } = useGLTF(file, "/draco/gltf/");
  const base = useMemo(
    () => processScene(scene, finish, rotateY, file),
    [scene, finish, rotateY, file]
  );
  return <Clone object={base.wrapper} />;
}

export default function ZoneModel({
  file,
  finish,
  rotateY,
  stepM,
  bays,
  position = [0, 0, 0],
  rowRotationY = 0,
  onUnitClick,
  activeUnit = null,
  bayFiles,
}: ZoneModelProps) {
  const { scene } = useGLTF(file, "/draco/gltf/");

  const base = useMemo(
    () => processScene(scene, finish, rotateY, file),
    [scene, finish, rotateY, file]
  );

  const span = (bays - 1) * stepM;
  const s = base.size;

  return (
    <group position={position} rotation={[0, rowRotationY, 0]}>
      {Array.from({ length: bays }).map((_, i) => {
        const x = i * stepM - span / 2;
        const currentBayFile = bayFiles?.[i] || file;
        const isSwapped = !!bayFiles?.[i] && bayFiles[i] !== file;

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
            {/* Invisible hit target for smooth raycasting click */}
            <mesh position={[0, s.y / 2, 0]}>
              <boxGeometry
                args={[
                  Math.max(s.x, stepM),
                  Math.max(s.y, 1.2),
                  Math.max(s.z, 0.8),
                ]}
              />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {isSwapped ? (
              <BayUnitMesh file={currentBayFile} finish={finish} rotateY={rotateY} />
            ) : (
              <Clone object={base.wrapper} />
            )}

            {activeUnit === i && (
              <group position={[0, s.y / 2, 0]}>
                {/* Red wireframe selection box */}
                <mesh>
                  <boxGeometry
                    args={[
                      Math.max(s.x, stepM) * 1.08,
                      s.y * 1.06,
                      s.z * 1.16,
                    ]}
                  />
                  <meshBasicMaterial color="#D92C32" wireframe />
                </mesh>
                {/* Top pyramid pointer */}
                <mesh position={[0, s.y * 0.6 + 0.15, 0]}>
                  <coneGeometry args={[0.2, 0.32, 4]} />
                  <meshBasicMaterial color="#D92C32" wireframe />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
