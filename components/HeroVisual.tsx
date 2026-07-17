"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars } from "@react-three/drei";
import type { Mesh } from "three";

type Ptr = { x: number; y: number };

function IndigoOrb({ pointer }: { pointer: React.MutableRefObject<Ptr> }) {
  const mesh = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current || !glow.current) return;
    mesh.current.rotation.y += delta * 0.35;
    mesh.current.rotation.x += delta * 0.12;
    const tx = pointer.current.x * 0.55;
    const ty = pointer.current.y * 0.4;
    mesh.current.position.x += (tx - mesh.current.position.x) * 0.06;
    mesh.current.position.y += (ty - mesh.current.position.y) * 0.06;
    glow.current.position.copy(mesh.current.position);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
      <Sphere ref={glow} args={[1.55, 32, 32]}>
        <meshBasicMaterial color="#1500ff" transparent opacity={0.12} />
      </Sphere>
      <Sphere ref={mesh} args={[1.05, 64, 64]}>
        <meshStandardMaterial
          color="#1a0a8a"
          emissive="#1500ff"
          emissiveIntensity={0.55}
          metalness={0.65}
          roughness={0.25}
        />
      </Sphere>
      <Sphere args={[1.12, 32, 32]}>
        <meshBasicMaterial color="#5ee87a" wireframe transparent opacity={0.08} />
      </Sphere>
    </Float>
  );
}

function Scene({ pointer }: { pointer: React.MutableRefObject<Ptr> }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={1.4} color="#1500ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.45} color="#5ee87a" />
      <Stars radius={40} depth={30} count={900} factor={2.2} saturation={0} fade speed={0.4} />
      <IndigoOrb pointer={pointer} />
    </>
  );
}

function FallbackVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="h-48 w-48 rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(21,0,255,0.55), rgba(21,0,255,0.12) 45%, transparent 70%)",
          boxShadow: "0 0 80px rgba(21,0,255,0.35)",
        }}
      />
    </div>
  );
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<Ptr>({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
        y: -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1),
      };
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  if (!mounted || reduced) {
    return (
      <div ref={containerRef} className="relative h-[min(520px,70vh)] w-full">
        <FallbackVisual />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[min(520px,70vh)] w-full">
      <div
        className="absolute inset-0 rounded-[var(--radius-cards)]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(21,0,255,0.18), transparent 70%)",
        }}
      />
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
