import React from 'react';

// Map settings
const mapSize = 60;
const mapHeight = 20;

const GameMap: React.FC = () => {
  return (
    <group>
      {/* Base terrain - green grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[mapSize * 2, mapSize * 2]} />
        <meshStandardMaterial color="#4CA64C" /> {/* Grass green */}
      </mesh>

      {/* Lake/water area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, -0.3, 20]} receiveShadow>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.8} />
      </mesh>

      {/* Beach/shoreline around the lake */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, -0.4, 18]} receiveShadow>
        <ringGeometry args={[16, 19, 32]} />
        <meshStandardMaterial color="#f9d3a7" /> {/* Sand color */}
      </mesh>

      {/* Hills and terrain features */}
      {[
        [-25, 3, -25, 10, 5],
        [25, 2, 25, 8, 4],
        [15, 4, -20, 12, 7],
        [-10, 1, 5, 6, 2],
      ].map((hill, i) => (
        <mesh key={`hill-${i}`} position={[hill[0], hill[1], hill[2]]} castShadow receiveShadow>
          <coneGeometry args={[hill[3], hill[4], 8]} />
          <meshStandardMaterial color="#5a8f41" /> {/* Hill green */}
        </mesh>
      ))}

      {/* Castle on hill - Fortnite style */}
      <group position={[15, 5, -15]}>
        {/* Hill/mountain */}
        <mesh position={[0, -3, 0]} castShadow receiveShadow>
          <coneGeometry args={[20, 10, 8]} />
          <meshStandardMaterial color="#8B5A2B" /> {/* Brown mountain */}
        </mesh>

        {/* Main castle building */}
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 8, 10]} />
          <meshStandardMaterial color="#A9A9A9" /> {/* Stone gray */}
        </mesh>

        {/* Castle towers */}
        {[[-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4]].map((pos, i) => (
          <group key={`tower-${i}`}>
            <mesh position={[pos[0], pos[1] + 6, pos[2]]} castShadow receiveShadow>
              <cylinderGeometry args={[1.5, 2, 6, 8]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
            {/* Tower top */}
            <mesh position={[pos[0], pos[1] + 9.5, pos[2]]}>
              <coneGeometry args={[2, 3, 8]} />
              <meshStandardMaterial color="#A52A2A" /> {/* Brown roof */}
            </mesh>
            {/* Tower window */}
            <mesh position={[pos[0], pos[1] + 6, pos[2] + 1.6]} castShadow>
              <boxGeometry args={[0.8, 0.8, 0.1]} />
              <meshStandardMaterial color="#000" opacity={0.7} transparent />
            </mesh>
          </group>
        ))}

        {/* Castle door */}
        <mesh position={[0, 0, 5.1]} castShadow>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial color="#8B4513" /> {/* Brown door */}
        </mesh>

        {/* Castle windows */}
        {[[-3, 3, 5.1], [3, 3, 5.1], [-3, 3, -5.1], [3, 3, -5.1]].map((pos, i) => (
          <mesh key={`window-${i}`} position={pos} castShadow>
            <boxGeometry args={[1.5, 1.5, 0.1]} />
            <meshStandardMaterial color="#4682B4" opacity={0.7} transparent /> {/* Blue window */}
          </mesh>
        ))}
      </group>

      {/* Small house near the lake */}
      <group position={[-30, 0, 30]}>
        {/* House foundation */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 3, 6]} />
          <meshStandardMaterial color="#D2B48C" /> {/* Tan house */}
        </mesh>

        {/* House roof */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <coneGeometry args={[6, 3, 4]} />
          <meshStandardMaterial color="#8B0000" /> {/* Dark red roof */}
        </mesh>

        {/* House door */}
        <mesh position={[0, 0.5, 3.1]} castShadow>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial color="#8B4513" /> {/* Brown door */}
        </mesh>

        {/* House windows */}
        {[[-2, 1.5, 3.1], [2, 1.5, 3.1]].map((pos, i) => (
          <mesh key={`house-window-${i}`} position={pos} castShadow>
            <boxGeometry args={[1, 1, 0.1]} />
            <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent /> {/* Sky blue window */}
          </mesh>
        ))}

        {/* House chimney */}
        <mesh position={[2.5, 5, 0]} castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#A0522D" /> {/* Brown chimney */}
        </mesh>
      </group>

      {/* Yellow autumn trees */}
      {[
        [-5, 0, -15], [8, 0, 8], [-12, 0, -2], [20, 0, 10], [-18, 0, -18],
        [-28, 0, 15], [5, 0, -25], [28, 0, -12], [-22, 0, -30], [15, 0, 30]
      ].map((pos, i) => (
        <group key={`yellow-tree-${i}`} position={[pos[0], pos[1], pos[2]]}>
          {/* Trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.7, 4, 8]} />
            <meshStandardMaterial color="#8B4513" /> {/* Brown */}
          </mesh>
          {/* Leaves */}
          <mesh position={[0, 6, 0]} castShadow>
            <sphereGeometry args={[3, 16, 16]} />
            <meshStandardMaterial color="#FFA500" /> {/* Orange/yellow autumn */}
          </mesh>
        </group>
      ))}

      {/* Green trees */}
      {[
        [15, 0, 5], [-10, 0, -10], [25, 0, -5], [-25, 0, 5], [5, 0, 25],
        [30, 0, 30], [-15, 0, 35], [35, 0, -25], [-35, 0, -15], [0, 0, -35]
      ].map((pos, i) => (
        <group key={`green-tree-${i}`} position={[pos[0], pos[1], pos[2]]}>
          {/* Trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.7, 4, 8]} />
            <meshStandardMaterial color="#8B4513" /> {/* Brown */}
          </mesh>
          {/* Leaves - cone shaped pine trees */}
          <group>
            <mesh position={[0, 7, 0]} castShadow>
              <coneGeometry args={[2.5, 5, 8]} />
              <meshStandardMaterial color="#228B22" /> {/* Forest green */}
            </mesh>
            <mesh position={[0, 5, 0]} castShadow>
              <coneGeometry args={[3, 3, 8]} />
              <meshStandardMaterial color="#228B22" /> {/* Forest green */}
            </mesh>
          </group>
        </group>
      ))}

      {/* Small trees */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = Math.random() * 100 - 50;
        const z = Math.random() * 100 - 50;
        const height = 1 + Math.random() * 2;
        return (
          <group key={`small-tree-${i}`} position={[x, 0, z]}>
            <mesh position={[0, height/2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, height, 6]} />
              <meshStandardMaterial color="#8B4513" /> {/* Brown trunk */}
            </mesh>
            <mesh position={[0, height + 1, 0]} castShadow>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#006400" /> {/* Dark green */}
            </mesh>
          </group>
        );
      })}

      {/* Flowers in the meadow */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = Math.random() * 80 - 40;
        const z = Math.random() * 80 - 40;
        const color = ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FF4500', '#9932CC'][Math.floor(Math.random() * 6)];
        return (
          <mesh key={`flower-${i}`} position={[x, 0, z]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}

      {/* Rocks scattered around */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = Math.random() * 90 - 45;
        const z = Math.random() * 90 - 45;
        const size = 0.5 + Math.random() * 1.5;
        return (
          <mesh key={`rock-${i}`} position={[x, size/2 - 0.2, z]} castShadow receiveShadow>
            <dodecahedronGeometry args={[size, 0]} />
            <meshStandardMaterial color="#808080" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Surrounding hills to define the play area */}
      {[
        [0, 0, -mapSize + 5],
        [0, 0, mapSize - 5],
        [-mapSize + 5, 0, 0],
        [mapSize - 5, 0, 0]
      ].map((pos, i) => (
        <mesh key={`boundary-${i}`} position={[pos[0], 0, pos[2]]} castShadow receiveShadow>
          <cylinderGeometry args={[25, 30, 10, 6, 1, false, i * Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#6B8E23" /> {/* Olive green */}
        </mesh>
      ))}
    </group>
  );
};

export { mapSize, mapHeight };
export default GameMap;
