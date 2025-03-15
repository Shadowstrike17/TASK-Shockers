import { Vector3 } from 'three';
import React from 'react';

interface BotProps {
  position: Vector3;
  color: string;
  size: number;
  health: number;
  lookAt: Vector3;
}

const Bot: React.FC<BotProps> = ({ position, color, size, health, lookAt }) => {
  // Calculate direction to look at player
  const directionToPlayer = new Vector3().subVectors(lookAt, position).normalize();

  return (
    <group position={position}>
      {/* Bot body */}
      <mesh castShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Bot face - positioned to face the player */}
      <group position={directionToPlayer.clone().multiplyScalar(size * 0.9)}>
        {/* Eyes */}
        <mesh position={[-0.3, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" />
          {/* Pupil */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>

        <mesh position={[0.3, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" />
          {/* Pupil */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>

        {/* Mouth - angry looking when health is low */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.5, health > 50 ? 0.1 : 0.15, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      {/* Health bar */}
      <group position={[0, size + 0.5, 0]}>
        {/* Background */}
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[1, 0.2]} />
          <meshBasicMaterial color="#333" />
        </mesh>

        {/* Health indicator */}
        <mesh
          position={[-(1 - health/100) / 2, 0, 0.01]}
          scale={[health/100, 1, 1]}
        >
          <planeGeometry args={[1, 0.15]} />
          <meshBasicMaterial color={health > 50 ? "#00ff00" : health > 25 ? "#ffff00" : "#ff0000"} />
        </mesh>
      </group>
    </group>
  );
};

export default Bot;
