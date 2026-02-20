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
  const { scene } = useGLTF("/models/toyota-land-cruiser-300.glb");

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
      <primitive
        object={scene}
        scale={157.0}
        rotation={[0, Math.PI * 0.75, 0]}
      />{" "}
      {/* Slight 3/4 angle */}
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.22, 1); // ~4.5s gentle zoom-out

      const ease = 1 - Math.pow(1 - progress.current, 3);

      const startDist = 5.5;
      const endDist = 10;

      const dist = THREE.MathUtils.lerp(startDist, endDist, ease);

      cameraRef.current.position.set(4, 3, dist); // offset for dynamic SUV view
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

export default function ToyotaLandCruiser300Model() {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/40 bg-gradient-to-br from-gray-900 to-black relative">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
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
          intensity={1.0}
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
          <Environment preset="warehouse" background={false} />{" "}
          {/* neutral reflections */}
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.6} // slow & premium rotation
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={15}
        />
      </Canvas>

      {/* Required attribution badge */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-indigo-500/40">
        Model: 2022 Toyota Land Cruiser 300 VX.R by Ddiaz Design – CC BY-NC-SA –
        Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/toyota-land-cruiser-300.glb");
