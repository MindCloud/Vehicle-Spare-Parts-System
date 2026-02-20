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
  const { scene } = useGLTF("/models/jeep-wrangler-392-2023.glb");

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
        scale={142.85}
        rotation={[0, Math.PI * 0.18, 0]}
      />
    </Center>
  );
}

function AnimatedCamera() {
  const ref = useRef();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.18, 1);
      const ease = 1 - Math.pow(1 - progress.current, 3);
      const dist = THREE.MathUtils.lerp(5.8, 11, ease);
      ref.current.position.set(5.5, 3.5, dist);
      ref.current.lookAt(0, 1.8, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[5.5, 3.5, 5.8]}
      fov={39}
    />
  );
}

export default function JeepWrangler392Model() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
        <AnimatedCamera />

        <ambientLight intensity={0.65} />
        <directionalLight
          position={[14, 16, 12]}
          intensity={2.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-12, 9, -14]}
          intensity={1.3}
          color="#e0f0ff"
        />
        <pointLight
          position={[0, 7, -7]}
          intensity={1.7}
          color="#fff5e6"
          decay={2}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.45}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/jeep-wrangler-392-2023.glb");
