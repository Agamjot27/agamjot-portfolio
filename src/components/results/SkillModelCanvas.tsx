"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Float, PresentationControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";

type SkillModelCanvasProps = {
  modelPath: string;
  rotation?: [number, number, number];
  active?: boolean;
  /** Extra padding inside the tile (higher = smaller model) */
  fitMargin?: number;
};

function Model({
  modelPath,
  rotation = [0, 0, 0],
  active = false,
  fitMargin = 1.55,
}: SkillModelCanvasProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);
  const model = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (active ? 0.7 : 0.2);
    }
  });

  return (
    <Bounds fit clip observe margin={fitMargin}>
      <Float
        speed={active ? 1.2 : 0.8}
        rotationIntensity={0.08}
        floatIntensity={0.12}
      >
        <group ref={group} rotation={rotation}>
          <primitive object={model} />
        </group>
      </Float>
    </Bounds>
  );
}

export default function SkillModelCanvas({
  modelPath,
  rotation = [0, 0, 0],
  active = false,
  fitMargin = 1.55,
}: SkillModelCanvasProps) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, 0, 6], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[5, 8, 6]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />
      <Suspense fallback={null}>
        <PresentationControls
          enabled={active}
          global
          polar={[-0.45, 0.45]}
          azimuth={[-0.7, 0.7]}
        >
          <Model
            modelPath={modelPath}
            rotation={rotation}
            active={active}
            fitMargin={fitMargin}
          />
        </PresentationControls>
      </Suspense>
    </Canvas>
  );
}
