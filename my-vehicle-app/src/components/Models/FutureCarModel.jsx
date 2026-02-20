// src/components/Models/FutureCarModel.jsx
import { useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/future-car.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center top>
      <primitive object={scene} scale={1.2} rotation={[0, Math.PI * 0.15, 0]} />
    </Center>
  );
}

function AnimatedCamera() {
  const ref = useRef();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.24, 1); // ~4.2s zoom-out
      const ease = 1 - Math.pow(1 - progress.current, 3);
      const dist = THREE.MathUtils.lerp(5.2, 10, ease);
      ref.current.position.set(3.5, 2.5, dist);
      ref.current.lookAt(0, 1, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[3.5, 2.5, 5.2]}
      fov={40}
    />
  );
}

export default function FutureCarModel() {
  return (
    <div className="w-full h-[420px] md:h-[520px] lg:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-600/30 bg-gradient-to-br from-gray-950 via-black to-gray-950 relative">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
        <AnimatedCamera />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[14, 16, 12]}
          intensity={2.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-12, 9, -12]}
          intensity={1.3}
          color="#d0e8ff"
        />
        <pointLight
          position={[0, 7, -7]}
          intensity={2}
          color="#fff0d9"
          decay={2.5}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="night" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.65}
          dampingFactor={0.1}
          minDistance={4}
          maxDistance={15}
        />
      </Canvas>

      {/* Required attribution */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-indigo-500/40">
        Model: Future Car by Rizky – CC Attribution – Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/future-car.glb");
