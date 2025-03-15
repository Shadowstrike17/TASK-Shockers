"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const weapons = [
  { id: "eggk-47", name: "EggK-47", icon: "🔫" },
  { id: "scrambler", name: "Scrambler", icon: "🔫" },
  { id: "free-ranger", name: "Free Ranger", icon: "🔫" },
  { id: "rpegg", name: "RPEGG", icon: "🔫" },
  { id: "whipper", name: "Whipper", icon: "🔫" },
  { id: "crackshot", name: "Crackshot", icon: "🔫" },
  { id: "tri-hard", name: "Tri-Hard", icon: "🔫" }
];

interface WeaponSelectorProps {
  selectedWeapon: string;
  onSelectWeapon: (weaponId: string) => void;
}

export function WeaponSelector({ selectedWeapon, onSelectWeapon }: WeaponSelectorProps) {
  return (
    <div className="flex justify-center p-2 gap-2 mt-4 bg-shellshock-blue/50 rounded-md">
      {weapons.map((weapon) => (
        <Button
          key={weapon.id}
          variant="outline"
          className={`p-2 ${
            selectedWeapon === weapon.id
              ? "bg-shellshock-orange border-2 border-yellow-300"
              : "bg-shellshock-blue"
          } hover:bg-shellshock-orange transition-colors`}
          onClick={() => onSelectWeapon(weapon.id)}
        >
          <span className="text-xl">{weapon.icon}</span>
        </Button>
      ))}
    </div>
  );
}
