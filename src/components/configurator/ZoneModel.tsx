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

function processScene(src: THREE.Object3D, finishId: FinishId, rotateY: boolean) {
  const root = skeletonClone(src);
  if (rotateY) root.rotation.y = Math.PI / 2;

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
    } else {
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

    if (!KEEP.test(name) || mesh.geometry.getAttribute("color")) {
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
}: ZoneModelProps) {
  const { scene } = useGLTF(file, "/draco/gltf/");

  const base = useMemo(
    () => processScene(scene, finish, rotateY),
    [scene, finish, rotateY]
  );

  const span = (bays - 1) * stepM;
  const s = base.size;

  return (
    <group position={position} rotation={[0, rowRotationY, 0]}>
      {Array.from({ length: bays }).map((_, i) => {
        const x = i * stepM - span / 2;
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
            <Clone object={base.wrapper} />
            {activeUnit === i && (
              <mesh position={[0, s.y / 2, 0]}>
                <boxGeometry args={[Math.max(s.x, stepM) * 1.04, s.y * 1.03, s.z * 1.1]} />
                <meshBasicMaterial color="#B5352E" wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
