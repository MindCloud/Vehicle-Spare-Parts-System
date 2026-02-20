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
  const { scene } = useGLTF("/models/defender-pickup.glb");

  // Enable shadows for realism
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center top>
      <primitive
        object={scene}
        scale={152.4}
        rotation={[0, Math.PI * 0.7, 0]}
      />
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.22, 1); // ~4.5s zoom-out

      const ease = 1 - Math.pow(1 - progress.current, 3);

      const startDist = 5.5;
      const endDist = 10;

      const dist = THREE.MathUtils.lerp(startDist, endDist, ease);

      cameraRef.current.position.set(4, 3, dist); // 3/4 elevated view
      cameraRef.current.lookAt(0, 1.2, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[4, 3, 5.5]}
      fov={40}
    />
  );
}

export default function DefenderPickupModel() {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-gradient-to-br from-gray-900 to-black relative">
      <Canvas shadows dpr={[1, 1.8]}>
        <AnimatedCamera />

        <ambientLight intensity={0.8} />
        <directionalLight
          position={[12, 14, 10]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-10, 8, -8]}
          intensity={1}
          color="#e0f0ff"
        />
        <pointLight
          position={[0, 6, -5]}
          intensity={1.5}
          color="#fff8e1"
          decay={2}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="warehouse" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.6}
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={15}
        />
      </Canvas>

      {/* Attribution (required by CC Attribution license) */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-indigo-500/40">
        Model: Land Rover Defender 110 Double Cab Pick Up by Ddiaz Design – CC
        Attribution – Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/defender-pickup.glb");
