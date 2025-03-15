"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Fullscreen } from "lucide-react";

export function Header() {
  return (
    <header className="w-full px-4 py-2 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/">
          <div className="font-sigma text-3xl text-shellshock-brown">
            <span className="text-shellshock-blue">TASK</span>
            <span className="text-shellshock-brown"> SHOCKERS</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-4 flex items-center">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
            <span className="text-black font-bold">0</span>
          </div>
        </div>

        <Button
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2"
        >
          SIGN IN
        </Button>

        <Button variant="outline" className="bg-shellshock-blue p-2 border-none">
          <Settings className="w-5 h-5 text-white" />
        </Button>

        <Button variant="outline" className="bg-shellshock-blue p-2 border-none">
          <Fullscreen className="w-5 h-5 text-white" />
        </Button>
      </div>
    </header>
  );
}
