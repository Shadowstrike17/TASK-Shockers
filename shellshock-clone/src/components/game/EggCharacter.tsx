"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function EggModel() {
  // This is a simplified egg shape using a sphere
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Simple eyes */}
      <mesh position={[-0.3, 0.3, 0.8]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.3, 0.3, 0.8]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Simple hat */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 0.4, 32]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}

export function EggCharacter({ className = "", weaponType = "EggK-47" }: { className?: string, weaponType?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative w-full h-[300px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stage environment="city" intensity={0.6}>
          <EggModel />
        </Stage>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <div className="text-xl font-sigma text-shellshock-blue">{weaponType}</div>
        <div className="text-sm text-gray-600">The classic, high rate of fire, medium range, never jams</div>
      </div>
    </div>
  );
}
