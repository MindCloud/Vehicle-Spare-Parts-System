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
  const { scene } = useGLTF("/models/jeep-wrangler-rubicon.glb");

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
        scale={140.9}
        rotation={[0, Math.PI * 0.15, 0]}
      />
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!cameraRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.2, 1);
      const ease = 1 - Math.pow(1 - progress.current, 3);
      const dist = THREE.MathUtils.lerp(5.5, 10.5, ease);
      cameraRef.current.position.set(5, 3.2, dist);
      cameraRef.current.lookAt(0, 1.5, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[5, 3.2, 5.5]}
      fov={40}
    />
  );
}

export default function JeepWranglerRubiconModel() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5, 3.2, 10.5], fov: 40 }}
      >
        <AnimatedCamera />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[12, 15, 10]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-10, 8, -12]}
          intensity={1.1}
          color="#e0f0ff"
        />
        <pointLight
          position={[0, 6, -6]}
          intensity={1.6}
          color="#fff8e1"
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
          autoRotateSpeed={0.4}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/jeep-wrangler-rubicon.glb");
