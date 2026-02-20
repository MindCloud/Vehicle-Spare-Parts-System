// src/components/Models/OffroadTiresModel.jsx
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  const { scene } = useGLTF("/models/offroad-tires.glb");
  console.log("Tires GLTF loaded successfully:", scene); // ← Debug: should print valid THREE.Group/Scene

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <Center top>
      <primitive object={scene} scale={3.5} />{" "}
      {/* Increased scale – tires are often small */}
    </Center>
  );
}

export default function OffroadTiresModel() {
  console.log("OffroadTiresModel rendering"); // Debug mount

  return (
    <div className="w-full aspect-[4/3] min-h-[320px] md:min-h-[420px] rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 bg-gradient-to-br from-gray-900 to-black relative">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 12, 8]} intensity={2} castShadow />
        <directionalLight position={[-8, 6, -6]} intensity={0.9} />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          autoRotate
          autoRotateSpeed={1.2}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-gray-400 border border-gray-600/50">
        Model: Offroad Vehicle Tires by Peter Gatchev – Free Standard –
        Sketchfab
      </div>
    </div>
  );
}

useGLTF.preload("/models/offroad-tires.glb");
