// src/components/Models/LandCruiserModel.jsx
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
  // This line was failing → now correct path
  const {
    scene,
  } = // Option C – relative (avoid if possible)
    useGLTF("/models/land-cruiser.glb"); // fragile

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center top>
      <primitive object={scene} scale={1.6} rotation={[0, Math.PI * 0.75, 0]} />
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.25, 1);
      const ease = 1 - Math.pow(1 - progress.current, 3);
      const startDist = 6;
      const endDist = 11;
      const dist = THREE.MathUtils.lerp(startDist, endDist, ease);
      cameraRef.current.position.set(5, 3.5, dist);
      cameraRef.current.lookAt(0, 1.5, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[5, 3.5, 6]}
      fov={38}
    />
  );
}

export default function LandCruiserModel() {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black relative">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
        <AnimatedCamera />

        <ambientLight intensity={0.9} />
        <directionalLight
          position={[15, 18, 12]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-12, 10, -10]}
          intensity={1.2}
          color="#d0e0ff"
        />
        <pointLight
          position={[0, 8, -7]}
          intensity={1.8}
          color="#fff5e6"
          decay={2}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.5}
          dampingFactor={0.1}
          minDistance={5}
          maxDistance={16}
        />
      </Canvas>

      {/* Attribution */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-orange-500/40">
        Model: 2022 Toyota Land Cruiser 300 VXR by Ddiaz Design – CC Attribution
        – Sketchfab
      </div>
    </div>
  );
}

// Fix: correct path here too
useGLTF.preload("/models/land-cruiser.glb");
