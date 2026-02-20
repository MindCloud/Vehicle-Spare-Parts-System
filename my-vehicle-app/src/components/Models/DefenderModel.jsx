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
  const { scene } = useGLTF("/models/defender.glb");
  return (
    <Center top>
      <primitive object={scene} scale={182.8} />{" "}
      {/* Adjust scale based on model size */}
    </Center>
  );
}

export default function DefenderModel() {
  return (
    <div className="w-full h-[450px] md:h-[550px] lg:h-[650px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 4, 10]} fov={40} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 12, 10]} intensity={1.6} castShadow />
        <directionalLight position={[-8, 6, -6]} intensity={0.7} />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="warehouse" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/defender.glb");
