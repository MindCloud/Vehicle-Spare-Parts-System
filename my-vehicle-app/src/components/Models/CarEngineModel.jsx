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
  const { scene } = useGLTF("/models/car-engine.glb");
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return (
    <Center>
      <primitive object={scene} scale={5.6} rotation={[0, Math.PI / 2, 0]} />
    </Center>
  );
}

function AnimatedCamera() {
  const ref = useRef();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.25, 1);
      const ease = 1 - Math.pow(1 - progress.current, 3);
      const dist = THREE.MathUtils.lerp(4, 7.5, ease);
      ref.current.position.set(0, 1.5, dist);
      ref.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera ref={ref} makeDefault position={[0, 1.5, 4]} fov={45} />
  );
}

export default function CarEngineModel() {
  return (
    <div className="w-full h-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 bg-gradient-to-br from-gray-900 to-black relative">
      <Canvas shadows dpr={[1, 1.5]}>
        <AnimatedCamera />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 12, 8]} intensity={2.2} castShadow />
        <pointLight position={[-5, 6, -4]} intensity={1.4} color="#ffeedd" />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="studio" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          autoRotate
          autoRotateSpeed={0.8}
          dampingFactor={0.1}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-gray-400 border border-gray-600/50">
        Model: Car Engine by Davetheconqueror – CC Attribution – Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/car-engine.glb");
