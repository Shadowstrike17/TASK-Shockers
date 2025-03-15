"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, Facebook, Twitter, Instagram } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Slick Ya's Trickshot Highlights",
    author: "Slick Ya",
    thumbnail: "https://ext.same-assets.com/2090130804/2269754790.jpeg",
  },
  {
    id: 2,
    title: "The Saint Patricks Side of Shell Shockers!",
    author: "Clingzter",
    thumbnail: "https://ext.same-assets.com/1075386413/3323463082.jpeg",
  },
  {
    id: 3,
    title: "*NEW* Shamrocked Update with 3 New Maps (review)",
    author: "Buster_Ben1",
    thumbnail: "https://ext.same-assets.com/1801185578/804951468.jpeg",
  },
  {
    id: 4,
    title: "Twitch Drops 7 2025! New BWD RPEGG!!!",
    author: "Clingzter",
    thumbnail: "https://ext.same-assets.com/2196418217/355130894.jpeg",
  },
];

export function YoutubeSidebar() {
  return (
    <div className="w-[250px] bg-shellshock-blue rounded-md p-3">
      <div className="bg-shellshock-blue py-2 px-3 rounded-md flex items-center mb-3">
        <YoutubeIcon className="w-5 h-5 text-white mr-2" />
        <span className="text-white font-sigma tracking-wide">YOUTUBE</span>
      </div>

      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.id} className="flex gap-2">
            <div className="w-16 h-16 relative shrink-0">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-semibold text-white leading-tight">{video.title}</h3>
              <p className="text-xs text-gray-300 mt-auto text-right">{video.author}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <Button variant="outline" className="p-1 bg-shellshock-blue border-none">
          <Facebook className="w-5 h-5 text-white" />
        </Button>
        <Button variant="outline" className="p-1 bg-shellshock-blue border-none">
          <Twitter className="w-5 h-5 text-white" />
        </Button>
        <Button variant="outline" className="p-1 bg-shellshock-blue border-none">
          <Instagram className="w-5 h-5 text-white" />
        </Button>
        <Button variant="outline" className="p-1 bg-shellshock-blue border-none">
          <YoutubeIcon className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
