// CarModel.jsx
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";

function Car() {
  const { scene } = useGLTF("/models/car.glb");

  return (
    <Center>
      {/* Removed 'top' prop so it truly centers both horizontally + vertically */}
      <primitive
        object={scene}
        scale={170} // ← tune this value (2–4 range usually works for car models)
        position={[0, -1, 0]} // explicit reset – helps with some gltf origins
      />
    </Center>
  );
}

export default function CarModel() {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        className="w-full h-full"
      >
        <PerspectiveCamera
          makeDefault
          position={[5, 3, 10]} // balanced 3/4 view – adjust if needed
          fov={38} // tighter FOV = more professional look
        />

        <ambientLight intensity={0.9} />
        <directionalLight
          position={[10, 12, 10]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.7}
          color="#d1e8ff"
        />

        <Suspense fallback={null}>
          <Car />
          <Environment preset="city" background={false} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/car.glb");
