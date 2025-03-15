"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EggCharacter } from "./EggCharacter";
import { WeaponSelector } from "./WeaponSelector";
import { Play, Users } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the GameScene to avoid SSR issues with Three.js
const GameScene = dynamic(() => import('./GameScene').then(mod => ({ default: mod.GameScene })), { ssr: false });

const gameModes = [
  { id: "captula", name: "CAPTULA THE SPATULA" },
  { id: "teams", name: "TEAMS" },
  { id: "ffa", name: "FREE FOR ALL" },
  { id: "kotc", name: "KING OF THE COOP" },
];

export function GameInterface() {
  const [selectedWeapon, setSelectedWeapon] = useState("eggk-47");
  const [gameMode, setGameMode] = useState("captula");
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
  };

  const exitGame = () => {
    setIsPlaying(false);
  };

  // If in game mode, show the game scene
  if (isPlaying) {
    return <GameScene onExit={exitGame} selectedWeapon={selectedWeapon} />;
  }

  // Otherwise show the menu interface
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <EggCharacter
        weaponType={selectedWeapon.toUpperCase()}
        className="mb-4"
      />

      <WeaponSelector
        selectedWeapon={selectedWeapon}
        onSelectWeapon={setSelectedWeapon}
      />

      <div className="mt-6 flex gap-4">
        <Button
          variant="default"
          className="bg-shellshock-blue text-white font-sigma px-6 py-3 flex-1 hover:bg-shellshock-blue/90"
        >
          <Users className="mr-2" />
          PLAY WITH FRIENDS!
        </Button>

        <Button
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white font-sigma px-10 py-3 flex-1"
          onClick={startGame}
        >
          <Play className="mr-2" />
          PLAY
        </Button>
      </div>

      <div className="mt-4 relative">
        <Button
          variant="outline"
          className="bg-shellshock-blue text-white px-4 py-2 w-full flex justify-between font-sigma"
        >
          <span>GAME MODE</span>
          <span>{gameModes.find(mode => mode.id === gameMode)?.name}</span>
          <span>▼</span>
        </Button>

        {/* Game mode dropdown would go here */}
      </div>

      <div className="mt-6 text-xs text-center text-gray-700 flex justify-center items-center gap-4">
        <span>0.50.10</span>
        <span>|</span>
        <span>Privacy Policy</span>
        <span>|</span>
        <span>Terms of Service</span>
        <span>|</span>
        <span>FAQ/Feedback</span>
        <span>|</span>
        <span>© 2025 Blue Wizard Digital</span>
      </div>
    </div>
  );
}
