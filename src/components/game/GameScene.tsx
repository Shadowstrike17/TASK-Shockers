"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, Environment, Sky } from "@react-three/drei";
import { Vector3 } from "three";
import Bot from "./Bot";
import GameMap, { mapSize, mapHeight } from "./GameMap";

// Constants
const playerHeight = 2;
const GRAVITY = 0.01;
const JUMP_FORCE = 0.2;
const MOVE_SPEED = 0.12; // Slightly reduced for better control
const BOT_SPEED_BASE = 0.02; // Reduced base speed for bots
const BOT_SPEED_MAX = 0.04; // Reduced max speed for bots
const SHOOT_FREQUENCY_BOTS = 0.002; // Reduced shooting frequency

// Types
type BotType = {
  id: number;
  position: Vector3;
  health: number;
  velocity: Vector3;
  color: string;
  size: number;
  lastMovementUpdate: number;
  lookAt: Vector3;
};

type PlayerType = {
  health: number;
  score: number;
  position: Vector3;
};

// Bullet component
function Bullet({ position, isPlayerBullet = false }: { position: Vector3, isPlayerBullet?: boolean }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color={isPlayerBullet ? "#ffff00" : "#ff5500"} emissive={isPlayerBullet ? "#ffff00" : "#ff5500"} emissiveIntensity={0.5} />
    </mesh>
  );
}

// Crosshair component
function Crosshair() {
  return (
    <group position={[0, 0, -2]}>
      {/* Center dot */}
      <mesh>
        <circleGeometry args={[0.003, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Outer circle */}
      <mesh>
        <ringGeometry args={[0.01, 0.012, 16]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>

      {/* Crosshair lines */}
      {[
        [0.02, 0, 0, 0.01, 0.001], // right
        [-0.02, 0, 0, 0.01, 0.001], // left
        [0, 0.02, 0, 0.001, 0.01], // top
        [0, -0.02, 0, 0.001, 0.01], // bottom
      ].map((config, i) => (
        <mesh key={i} position={[config[0], config[1], config[2]]}>
          <planeGeometry args={[config[3], config[4]]} />
          <meshBasicMaterial color="white" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Gun viewmodel (more visible in first person view)
function GunViewModel({ isFiring, weaponType }: { isFiring: boolean, weaponType: string }) {
  const ref = useRef<THREE.Group>(null);

  // Apply recoil animation when firing
  useEffect(() => {
    if (isFiring && ref.current) {
      // Initial position
      const startPos = { y: -0.2, z: -0.4 };
      // Recoil position
      const recoilPos = { y: -0.15, z: -0.35 };

      // Apply recoil
      ref.current.position.y = recoilPos.y;
      ref.current.position.z = recoilPos.z;

      // Reset after a short delay
      const timer = setTimeout(() => {
        if (ref.current) {
          ref.current.position.y = startPos.y;
          ref.current.position.z = startPos.z;
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isFiring]);

  return (
    <group ref={ref} position={[0.3, -0.2, -0.4]}>
      {/* Gun body */}
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Barrel */}
      <mesh position={[0, 0.05, 0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.15, -0.1]}>
        <boxGeometry args={[0.08, 0.2, 0.15]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mag */}
      <mesh position={[0, -0.08, 0.1]}>
        <boxGeometry args={[0.09, 0.12, 0.2]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Weapon configurations
const weapons = {
  "eggk-47": {
    damage: 25,
    fireRate: 150,
    recoil: 0.02,
    bulletSpeed: 0.8
  },
  "scrambler": {
    damage: 15,
    fireRate: 100,
    recoil: 0.01,
    bulletSpeed: 0.9
  },
  "free-ranger": {
    damage: 50,
    fireRate: 500,
    recoil: 0.04,
    bulletSpeed: 0.7
  },
};

// Game logic component
function GameLogicScene({
  onGameOver,
  selectedWeapon
}: {
  onGameOver: (won: boolean, score: number) => void,
  selectedWeapon: string
}) {
  const { camera, scene } = useThree();

  // Player state
  const [player, setPlayer] = useState<PlayerType>({
    health: 100,
    score: 0,
    position: new Vector3(0, playerHeight, 0)
  });

  // Game state
  const [bots, setBots] = useState<BotType[]>([]);
  const [bullets, setBullets] = useState<{position: Vector3, direction: Vector3, isPlayerBullet: boolean}[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [message, setMessage] = useState("Get Ready!");
  const [isFiring, setIsFiring] = useState(false);
  const [damageIndicator, setDamageIndicator] = useState(0);
  const [showEscMenu, setShowEscMenu] = useState(false);

  // Keyboard and physics controls
  const keysPressed = useRef<{[key: string]: boolean}>({});
  const jumpVelocity = useRef(0);
  const isOnGround = useRef(true);

  // Create bots with random positions
  const createBots = () => {
    const newBots: BotType[] = [];
    const colors = ["#ff5555", "#5555ff", "#55ff55", "#ffff55"];

    for (let i = 0; i < 4; i++) { // Only 4 enemies as requested
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 5;

      newBots.push({
        id: i,
        position: new Vector3(
          Math.cos(angle) * distance,
          0.5,
          Math.sin(angle) * distance
        ),
        health: 100,
        velocity: new Vector3(),
        color: colors[i],
        size: 1,
        lastMovementUpdate: Date.now(),
        lookAt: new Vector3(0, playerHeight, 0) // Initially look at player spawn
      });
    }

    setBots(newBots);
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // Jump when space is pressed and player is on ground
      if (e.code === 'Space' && isOnGround.current) {
        jumpVelocity.current = JUMP_FORCE;
        isOnGround.current = false;
      }

      // Toggle escape menu
      if (e.code === 'Escape') {
        setShowEscMenu(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    // Handle shooting with mouse
    const handleMouseDown = () => {
      if (gameStarted && !gameEnded && !showEscMenu) {
        // Create bullet from camera position in looking direction
        const direction = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

        setBullets(prev => [...prev, {
          position: new Vector3().copy(camera.position).add(direction.clone().multiplyScalar(1)),
          direction: direction,
          isPlayerBullet: true
        }]);

        // Trigger firing animation
        setIsFiring(true);
        setTimeout(() => setIsFiring(false), 50);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    // Lock pointer on click to enable FPS controls
    const handleClick = () => {
      if (!showEscMenu) {
        document.body.requestPointerLock();
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('click', handleClick);
    };
  }, [camera, gameStarted, gameEnded, showEscMenu]);

  // Game countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setMessage(`${countdown - 1 > 0 ? countdown - 1 : 'GO!'}`);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      createBots();
      setTimeout(() => {
        setMessage("");
      }, 1000);
    }
  }, [countdown, gameStarted]);

  // Damage effect timer
  useEffect(() => {
    if (damageIndicator > 0) {
      const timer = setTimeout(() => {
        setDamageIndicator(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [damageIndicator]);

  // Game loop with movement, bullets, and bot AI
  useFrame((_, delta) => {
    if (!gameStarted || gameEnded || showEscMenu) return;

    // Update player position from camera
    setPlayer(prev => ({
      ...prev,
      position: new Vector3(camera.position.x, camera.position.y, camera.position.z)
    }));

    // Movement controls (WASD)
    const moveDir = new Vector3(0, 0, 0);
    if (keysPressed.current['w']) moveDir.z -= 1;
    if (keysPressed.current['s']) moveDir.z += 1;
    if (keysPressed.current['a']) moveDir.x -= 1;
    if (keysPressed.current['d']) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize().multiplyScalar(MOVE_SPEED);

      // Make movement relative to camera direction (excluding Y rotation)
      moveDir.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y);

      // Apply movement
      camera.position.x += moveDir.x;
      camera.position.z += moveDir.z;

      // Keep player within map bounds
      camera.position.x = Math.max(-mapSize + 5, Math.min(mapSize - 5, camera.position.x));
      camera.position.z = Math.max(-mapSize + 5, Math.min(mapSize - 5, camera.position.z));
    }

    // Jumping and gravity
    if (!isOnGround.current || jumpVelocity.current > 0) {
      // Apply gravity
      jumpVelocity.current -= GRAVITY;

      // Apply vertical movement
      camera.position.y += jumpVelocity.current;

      // Check if landed
      if (camera.position.y <= playerHeight) {
        camera.position.y = playerHeight;
        jumpVelocity.current = 0;
        isOnGround.current = true;
      }
    }

    // Update bullets
    setBullets(prev => {
      return prev.filter(bullet => {
        // Move bullet
        bullet.position.add(bullet.direction.clone().multiplyScalar(0.8));

        // Check for bot hits
        if (bullet.isPlayerBullet) {
          let hitBot = false;

          setBots(prevBots => {
            return prevBots.map(bot => {
              if (bullet.position.distanceTo(bot.position) < bot.size) {
                hitBot = true;
                const newHealth = bot.health - 25;

                // If bot is eliminated
                if (newHealth <= 0) {
                  setPlayer(p => ({
                    ...p,
                    score: p.score + 1
                  }));

                  // Check if all bots are eliminated
                  const remainingBots = prevBots.filter(b => b.id !== bot.id && b.health > 0);
                  if (remainingBots.length === 0) {
                    setGameEnded(true);
                    onGameOver(true, player.score + 1);
                  }

                  return { ...bot, health: 0 };
                }

                return { ...bot, health: newHealth };
              }
              return bot;
            });
          });

          if (hitBot) return false;
        }
        // Player hit check
        else {
          if (bullet.position.distanceTo(camera.position) < 1) {
            setPlayer(p => {
              const newHealth = p.health - 10;
              setDamageIndicator(1);

              if (newHealth <= 0) {
                setGameEnded(true);
                onGameOver(false, p.score);
              }

              return { ...p, health: Math.max(0, newHealth) };
            });

            return false;
          }
        }

        // Remove bullets that hit walls or go out of bounds
        const outOfBounds =
          bullet.position.x > mapSize || bullet.position.x < -mapSize ||
          bullet.position.z > mapSize || bullet.position.z < -mapSize ||
          bullet.position.y < 0 || bullet.position.y > 50;

        return !outOfBounds;
      });
    });

    // Update bot AI with slower movement
    setBots(prevBots => {
      return prevBots.map(bot => {
        if (bot.health <= 0) return bot;

        // Update lookup direction to face player
        const lookAt = new Vector3().copy(camera.position);

        // Bot movement AI - update every half second
        if (Date.now() - bot.lastMovementUpdate > 500) {
          // Calculate direction to player
          const dirToPlayer = new Vector3()
            .copy(camera.position)
            .sub(bot.position)
            .normalize();

          // Add some randomness to movement
          const randomDir = new Vector3(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.5
          );

          // Combine directions (70% towards player, 30% random)
          const moveDir = dirToPlayer.multiplyScalar(0.7).add(randomDir).normalize();

          // Set velocity based on distance to player (move slower overall)
          const distToPlayer = bot.position.distanceTo(camera.position);
          const speedMultiplier = Math.min(0.8, distToPlayer / 30); // Reduced speed
          const botSpeed = BOT_SPEED_BASE + speedMultiplier * (BOT_SPEED_MAX - BOT_SPEED_BASE);

          return {
            ...bot,
            velocity: moveDir.multiplyScalar(botSpeed),
            lastMovementUpdate: Date.now(),
            lookAt
          };
        }

        // Move bot
        const newPosition = new Vector3().copy(bot.position).add(bot.velocity);

        // Keep bots within bounds
        newPosition.x = Math.max(-mapSize + 5, Math.min(mapSize - 5, newPosition.x));
        newPosition.z = Math.max(-mapSize + 5, Math.min(mapSize - 5, newPosition.z));

        // Bot shooting - less frequent shooting
        const distToPlayer = bot.position.distanceTo(camera.position);
        const shootChance = SHOOT_FREQUENCY_BOTS + (1 - Math.min(1, distToPlayer / 25)) * 0.005;

        if (Math.random() < shootChance) {
          // Direction to player with some inaccuracy
          const shootDir = new Vector3()
            .copy(camera.position)
            .sub(bot.position)
            .normalize();

          // Add inaccuracy based on distance
          shootDir.x += (Math.random() - 0.5) * 0.1 * (distToPlayer / 10);
          shootDir.y += (Math.random() - 0.5) * 0.1 * (distToPlayer / 10);
          shootDir.z += (Math.random() - 0.5) * 0.1 * (distToPlayer / 10);
          shootDir.normalize();

          setBullets(prev => [...prev, {
            position: new Vector3().copy(bot.position).add(shootDir.multiplyScalar(bot.size + 0.2)),
            direction: shootDir,
            isPlayerBullet: false
          }]);
        }

        return { ...bot, position: newPosition, lookAt };
      });
    });
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[50, 100, 20]} intensity={1} castShadow />

      {/* Map */}
      <GameMap />

      {/* Bots */}
      {bots.map((bot) => (
        bot.health > 0 && (
          <Bot
            key={bot.id}
            position={bot.position}
            color={bot.color}
            size={bot.size}
            health={bot.health}
            lookAt={bot.lookAt}
          />
        )
      ))}

      {/* Bullets */}
      {bullets.map((bullet, i) => (
        <Bullet
          key={`bullet-${i}`}
          position={bullet.position}
          isPlayerBullet={bullet.isPlayerBullet}
        />
      ))}

      {/* Game Messages */}
      {message && (
        <Text
          position={[0, 1, -3]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {message}
        </Text>
      )}

      {/* Gun viewmodel in first person */}
      <GunViewModel isFiring={isFiring} weaponType={selectedWeapon} />

      {/* Crosshair */}
      <Crosshair />

      {/* Health & Score HUD */}
      <group position={[0, 0, -1]}>
        {/* Health bar */}
        <mesh position={[-0.5, -0.4, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.3, 0.05]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.7} />
        </mesh>

        <mesh
          position={[-0.5 + ((100 - player.health) * 0.0015), -0.4, -0.01]}
          scale={[player.health / 100, 1, 1]}
        >
          <planeGeometry args={[0.3, 0.03]} />
          <meshBasicMaterial
            color={player.health > 60 ? "#00ff00" : player.health > 30 ? "#ffff00" : "#ff0000"}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Score */}
        <Text
          position={[0.5, -0.4, 0]}
          fontSize={0.05}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
        >
          SCORE: {player.score}
        </Text>
      </group>

      {/* Damage overlay */}
      {damageIndicator > 0 && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Escape menu */}
      {showEscMenu && (
        <group position={[0, 0, -3]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 1.2]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </mesh>

          <Text
            position={[0, 0.4, 0.1]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            PAUSED
          </Text>

          <group position={[0, 0, 0.1]} onClick={() => setShowEscMenu(false)}>
            <mesh position={[0, 0.1, 0]}>
              <planeGeometry args={[1, 0.2]} />
              <meshBasicMaterial color="#444444" />
            </mesh>

            <Text
              position={[0, 0.1, 0.1]}
              fontSize={0.1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              RESUME
            </Text>
          </group>

          <group position={[0, -0.2, 0.1]} onClick={() => onGameOver(false, player.score)}>
            <mesh>
              <planeGeometry args={[1, 0.2]} />
              <meshBasicMaterial color="#444444" />
            </mesh>

            <Text
              position={[0, 0, 0.1]}
              fontSize={0.1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              EXIT GAME
            </Text>
          </group>
        </group>
      )}

      <PointerLockControls />
    </>
  );
}

// Main export component
export function GameScene({ onExit, selectedWeapon = "eggk-47" }: { onExit: () => void, selectedWeapon?: string }) {
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleGameOver = (playerWon: boolean, score: number) => {
    setGameOver(true);
    setWon(playerWon);
    setFinalScore(score);

    // Exit pointer lock when game ends
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-2xl font-sigma text-white mb-4">Loading TASK Shockers...</h2>
          <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-shellshock-blue animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <h2 className="text-4xl font-sigma mb-4 text-white">
            {won ? "YOU WON!" : "GAME OVER"}
          </h2>
          <p className="text-xl text-white mb-8">Your score: {finalScore}</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-shellshock-blue text-white font-sigma rounded-md hover:bg-shellshock-blue/80"
          >
            BACK TO MENU
          </button>
        </div>
      ) : null}

      <Canvas shadows camera={{ position: [0, playerHeight, 0], fov: 75 }}>
        <Suspense fallback={null}>
          <GameLogicScene onGameOver={handleGameOver} selectedWeapon={selectedWeapon} />
          <Sky sunPosition={[100, 100, 20]} turbidity={10} rayleigh={0.5} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 text-white text-sm">
        <p>WASD to move | SPACE to jump | Mouse to aim | Click to shoot | ESC to pause</p>
      </div>
    </div>
  );
}
