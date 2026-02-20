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
  const { scene } = useGLTF("/models/bmw-m3-e30-racing.glb");

  // Optional: improve shadows/reflections
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center top>
      <primitive object={scene} scale={2.2} rotation={[0, Math.PI * 0.8, 0]} />{" "}
      {/* Slight angle for dynamic look */}
    </Center>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta * 0.25, 1); // ~4s zoom-out

      const ease = 1 - Math.pow(1 - progress.current, 3); // smooth cubic ease-out

      const startDist = 5;
      const endDist = 9.5;

      const dist = THREE.MathUtils.lerp(startDist, endDist, ease);

      cameraRef.current.position.set(3, 2.5, dist); // slight side offset for 3/4 view
      cameraRef.current.lookAt(0, 1, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[3, 2.5, 5]} // start closer
      fov={38} // tighter FOV = more cinematic
    />
  );
}

export default function BmwM3E30Model() {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true }}>
        <AnimatedCamera />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[12, 15, 10]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-10, 8, -8]}
          intensity={1.1}
          color="#e0f0ff"
        />
        <pointLight
          position={[0, 5, -6]}
          intensity={1.6}
          color="#fff8e1"
          decay={2}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="night" background={false} />{" "}
          {/* dramatic lighting for racing feel */}
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.7} // slow elegant spin
          dampingFactor={0.09}
          minDistance={4}
          maxDistance={14}
        />
      </Canvas>

      {/* Attribution badge */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-orange-500/40">
        Model: BMW M3 E30 Racing by DevPoly3D – CC BY – Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/bmw-m3-e30-racing.glb");
