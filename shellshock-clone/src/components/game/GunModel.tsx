"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, MeshStandardMaterial, Mesh } from 'three';

interface GunModelProps {
  weaponType: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isReloading?: boolean;
  isFiring?: boolean;
}

export function GunModel({
  weaponType = "eggk-47",
  position = [0.3, -0.35, -0.5],
  rotation = [0, 0, 0],
  scale = 0.2,
  isReloading = false,
  isFiring = false
}: GunModelProps) {
  const gunRef = useRef<Group>(null);

  // Simple animation for gun recoil when firing
  useFrame((_, delta) => {
    if (!gunRef.current) return;

    // Recoil animation
    if (isFiring && gunRef.current) {
      gunRef.current.position.z += 0.02;
      // Reset position after recoil
      setTimeout(() => {
        if (gunRef.current) {
          gunRef.current.position.z = position[2];
        }
      }, 50);
    }

    // Reload animation
    if (isReloading && gunRef.current) {
      gunRef.current.rotation.x = Math.sin(Date.now() * 0.01) * 0.2;

      // Reset rotation after reload
      if (!isReloading) {
        gunRef.current.rotation.x = rotation[0];
      }
    }
  });

  // Render different weapon models based on the selected type
  const renderGunModel = () => {
    switch (weaponType) {
      case "eggk-47":
        return <EggK47Model />;
      case "scrambler":
        return <ScramblerModel />;
      case "free-ranger":
        return <FreeRangerModel />;
      case "rpegg":
        return <RPEGGModel />;
      default:
        return <EggK47Model />;
    }
  };

  return (
    <group
      ref={gunRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {renderGunModel()}
    </group>
  );
}

// Basic gun models - in a real game you would use imported GLB/GLTF models
function EggK47Model() {
  return (
    <group>
      {/* Main Gun Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 3]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Barrel */}
      <mesh position={[0, 0.1, 1.7]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Magazine */}
      <mesh position={[0, -0.5, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.7, 1]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.5, -0.7]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.6]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Sight */}
      <mesh position={[0, 0.4, 0.5]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function ScramblerModel() {
  return (
    <group>
      {/* Shotgun Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 2.5]} />
        <meshStandardMaterial color="#8B4513" /> {/* Wood color */}
      </mesh>

      {/* Barrel */}
      <mesh position={[0, 0.1, 1.7]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Pump */}
      <mesh position={[0, -0.1, 0.8]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color="#5A3A22" />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.5, -0.7]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.6]} />
        <meshStandardMaterial color="#3A2A12" />
      </mesh>
    </group>
  );
}

function FreeRangerModel() {
  return (
    <group>
      {/* Sniper Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 3.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Long Barrel */}
      <mesh position={[0, 0, 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Scope */}
      <mesh position={[0, 0.4, 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Stock */}
      <mesh position={[0, 0, -1.2]} castShadow>
        <boxGeometry args={[0.4, 0.6, 1.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.5, -0.3]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

function RPEGGModel() {
  return (
    <group>
      {/* Rocket Launcher Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 3, 16]} />
        <meshStandardMaterial color="#2C5F2D" /> {/* Military green */}
      </mesh>

      {/* Launch Tube */}
      <mesh position={[0, 0, 1.8]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.5, -0.5]} rotation={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Rocket in the tube */}
      <mesh position={[0, 0, 1.6]} castShadow>
        <cylinderGeometry args={[0.2, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#B33A3A" />
      </mesh>

      {/* Sights */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}
