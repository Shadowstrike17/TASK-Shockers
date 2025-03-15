import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { GameInterface } from "@/components/game/GameInterface";
import { YoutubeSidebar } from "@/components/sidebar/YoutubeSidebar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex px-4 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 flex-grow flex items-center justify-center">
          <GameInterface />
        </main>

        <YoutubeSidebar />
      </div>

      <div className="py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-sigma text-shellshock-blue text-center mb-4">
            TASK SHOCKERS - FREE IO GAME
          </h1>

          <div className="text-center mb-4">
            <div className="font-bold">Free Web Game! No Download Required! Chromebook Friendly!</div>
            <div className="text-sm my-2">
              Blocked? Try geometry.monster for TASK Shockers unblocked io game.
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="mb-4">
                Welcome to TASK Shockers, the world&apos;s best multiplayer egg shooter! Play
                one of our FOUR EGG-CITING GAME MODES and choose from EIGHT EGG-CEPTIONAL
                WEAPONS to shoot your eggy friends!
              </p>

              <p className="mb-4">
                Play unlimited egg games with your pals in private games, or hop into public
                matches to fry some friends you haven&apos;t met yet. Explore dozens of unique
                maps and hone your egg combat style with our eight powerful weapons.
              </p>
            </div>

            <div className="flex-1">
              <p className="mb-4">
                Customize your shell with tons of hats and stamps (new items released twice
                per month)! You can even dye your egg a fabulous color. Join our VIP club and
                become VERY IMPORTANT POULTRY with egg-stra shell colors, free premium
                rewards, egg bonuses and more! Are you ready to play one of the best free io
                games around?
              </p>

              <p>Complete your TASKS before the enemy eggs get you! (Hint: it&apos;s yolk!)</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-sigma text-shellshock-blue mb-4">
              What are the TASK Shockers game modes?
            </h2>

            <ul className="list-disc pl-6 mb-6">
              <li>Mix with some good eggs in our classic <strong>Teams</strong> mode</li>
              <li>Be a free-range egg and take on everyone in <strong>Free For All</strong></li>
              <li>Join the other chefs in the kitchen to <strong>Captula The Spatula</strong></li>
              <li>Or become rooster royalty in our newest mode, <strong>King of the Coop</strong>!</li>
            </ul>

            <h2 className="text-2xl font-sigma text-shellshock-blue mb-4">
              How to Play TASK Shockers?
            </h2>

            <p className="mb-4">Use the following game controls to play the TASK Shockers web game:</p>

            <div className="grid grid-cols-2 gap-4">
              <ul className="list-disc pl-6">
                <li>WASD keys to move</li>
                <li>Spacebar to jump</li>
                <li>E to change weapons</li>
                <li>Q to launch a grenade</li>
                <li>G to inspect</li>
              </ul>

              <ul className="list-disc pl-6">
                <li>Left mouse to shoot</li>
                <li>Shift to aim</li>
                <li>R to reload</li>
                <li>F to melee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
