"use client";

import { User, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <div className="flex flex-col w-[200px] gap-2">
      <div className="w-full">
        <div className="bg-white rounded-md p-2 mb-2">
          <input
            type="text"
            placeholder="ShellSupreme13"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <Link
          href="/"
          onClick={() => setActiveTab("home")}
          className="block"
        >
          <Button
            variant="default"
            className={`w-full py-3 px-4 text-white font-sigma text-lg flex items-center gap-2 rounded-r-3xl rounded-l-sm ${
              activeTab === "home"
                ? "bg-orange-400 hover:bg-orange-500"
                : "bg-shellshock-blue hover:bg-shellshock-blue/90"
            }`}
          >
            <Home className="w-5 h-5" />
            HOME
          </Button>
        </Link>

        <Link
          href="/profile"
          onClick={() => setActiveTab("profile")}
          className="block mt-2"
        >
          <Button
            variant="default"
            className={`w-full py-3 px-4 text-white font-sigma text-lg flex items-center gap-2 rounded-r-3xl rounded-l-sm ${
              activeTab === "profile"
                ? "bg-orange-400 hover:bg-orange-500"
                : "bg-shellshock-blue hover:bg-shellshock-blue/90"
            }`}
          >
            <User className="w-5 h-5" />
            PROFILE
          </Button>
        </Link>
      </div>

      {/* Ad space placeholder */}
      <div className="w-full h-[150px] bg-gray-800 rounded-md flex items-center justify-center text-white mt-4">
        Ad Space
      </div>

      {/* Another ad space placeholder */}
      <div className="w-full h-[150px] bg-gray-800 rounded-md flex items-center justify-center text-white mt-4">
        Ad Space
      </div>
    </div>
  );
}
