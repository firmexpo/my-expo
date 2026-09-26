"use client";

import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { Float, OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state: RootState) => {
    if (!meshRef.current) return;

    const { x, y } = state.pointer;

    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;

    meshRef.current.rotation.x +=
      (y * 0.3 - meshRef.current.rotation.x) * 0.02;

    meshRef.current.rotation.y +=
      (x * 0.3 - meshRef.current.rotation.y) * 0.02;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 2]} />

        <meshStandardMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.8}
          wireframe
        />
      </mesh>

      <Sphere args={[1.3, 64, 64]}>
        <meshStandardMaterial
          color="#111111"
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 6],
        fov: 45,
      }}
    >
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      <pointLight
        position={[-5, -5, -5]}
        intensity={2}
      />

      <HeroObject />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Navigation */}

      <nav className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-8 py-6">

        <div className="text-xl font-bold tracking-tight">
          STUDIO<span className="text-neutral-500">3D</span>
        </div>

        <div className="hidden gap-8 text-sm text-neutral-400 md:flex">
          <a href="#" className="transition hover:text-white">
            Work
          </a>

          <a href="#" className="transition hover:text-white">
            About
          </a>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </div>

        <button className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black">
          Let's Talk
        </button>

      </nav>


      {/* Main content */}

      <div className="relative z-10 flex min-h-screen items-center">

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-8 py-32 md:grid-cols-2">

          {/* Text */}

          <div>

            <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
              Digital Experience
            </p>

            <h1 className="max-w-xl text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
              Build
              <br />
              beyond
              <br />
              <span className="text-neutral-500">
                reality.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-neutral-400">
              We create immersive digital experiences
              that combine technology, design and
              interactive 3D.
            </p>

            <div className="mt-10 flex gap-4">

              <button className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-neutral-200">
                Explore
              </button>

              <button className="rounded-full border border-white/20 px-7 py-3 text-sm transition hover:border-white">
                Our Work
              </button>

            </div>

          </div>


          {/* 3D */}

          <div className="h-[500px] w-full">

            <Scene />

          </div>

        </div>

      </div>


      {/* Bottom text */}

      <div className="absolute bottom-6 left-8 z-10 text-xs uppercase tracking-widest text-neutral-600">
        Move your cursor
      </div>

      <div className="absolute bottom-6 right-8 z-10 text-xs text-neutral-600">
        Scroll to explore ↓
      </div>

    </section>
  );
}