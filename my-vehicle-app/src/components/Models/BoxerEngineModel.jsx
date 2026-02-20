// src/components/BoxerEngineModel.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/boxer-engine.glb");

  // Optional: center pivot if model isn't already centered
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={-0.5} rotation={[0, Math.PI / 2, 0]} />
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const zoomProgress = useRef(0); // 0 → 1 over time

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // Gentle zoom-out phase (first ~3.5 seconds)
    if (zoomProgress.current < 1) {
      zoomProgress.current = Math.min(zoomProgress.current + delta * 0.28, 1); // ~3.5s duration

      const ease = 1 - Math.pow(1 - zoomProgress.current, 3); // cubic ease-out

      // Start closer (~4 units), end farther (~7.2 units)
      const startDist = 4;
      const endDist = 7.2;

      const distance = THREE.MathUtils.lerp(startDist, endDist, ease);

      // Keep looking at origin, move back along Z
      cameraRef.current.position.set(0, 1.8, distance);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1.8, 4]} // initial closer position
      fov={42} // slightly narrower FOV = more professional look
    />
  );
}

export default function BoxerEngineModel() {
  return (
    <div className="w-full h-[450px] sm:h-[520px] md:h-[580px] lg:h-[650px] xl:h-[720px] rounded-xl overflow-hidden shadow-2xl border border-gray-200/30 bg-gradient-to-br from-gray-900 to-black">
      <Canvas
        shadows
        dpr={[1, 1.5]} // balanced quality vs performance
        gl={{ antialias: true, alpha: false }}
      >
        <AnimatedCamera />

        {/* Lighting – professional studio feel */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 12, 8]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-8, 6, -6]}
          intensity={0.9}
          color="#d0e0ff"
        />
        <pointLight
          position={[0, 6, -4]}
          intensity={1.4}
          color="#fff5e6"
          decay={2}
        />

        <Suspense fallback={null}>
          <Model />
          {/* Subtle environment for realistic reflections */}
          <Environment preset="studio" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true} // allow user zoom if they want
          enablePan={true}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.6} // slow & elegant (~40 sec per turn)
          dampingFactor={0.08} // smooth inertia when user interacts
          rotateSpeed={0.5}
          zoomSpeed={1.1}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/boxer-engine.glb");
