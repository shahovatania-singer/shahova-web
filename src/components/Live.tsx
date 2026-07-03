"use client";

import React, { useState } from "react";
import VideoModal from "./VideoModal";

const PERFORMANCES = [
  {
    id: 1,
    title: "Solo Performance",
    image: "/image/Solo Performance.webp",
    video: "/video/Solo Performance.mp4",
  },
  {
    id: 2,
    title: "Let It Snow",
    image: "/image/Let It Snow L.webp",
    video: "/video/Let It Snow.mp4",
  },
  {
    id: 3,
    title: "Fly me to the moon",
    image: "/image/Fly me to the moon.webp",
    video: "/video/Fly me to the moon.mp4",
  },
  {
    id: 4,
    title: "S'Wonderful",
    image: "/image/S'Wonderful.webp",
    video: "/video/S'Wonderful.mp4",
  },
  {
    id: 5,
    title: "Celebration Party",
    image: "/image/Celebration Party.webp",
    video: "/video/Celebration Party.mp4",
  },
  {
    id: 6,
    title: "Full Band",
    image: "/image/Full Band.webp",
    video: "/video/Full Band.mp4",
  },
  {
    id: 7,
    title: "Sway",
    image: "/image/Sway m.webp",
    video: "/video/Sway.mp4",
  },
  {
    id: 8,
    title: "All I want for Christmas",
    image: "/image/All I want for Christmas.webp",
    video: "/video/All I want for Christmas.mp4",
  },
];

export default function Live() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    image: string;
  } | null>(null);

  const openVideo = (videoUrl: string, title: string, image: string) => {
    setSelectedVideo({ url: videoUrl, title, image });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <section
      id="live"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase mb-4">
          Feel the magic of the stage
        </p>
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          LIVE PERFORMANCES
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full">
        {PERFORMANCES.map((perf) => (
          <div
            key={perf.id}
            onClick={() => openVideo(perf.video, perf.title, perf.image)}
            className="group relative w-full aspect-[4/3] bg-[#050505] cursor-pointer overflow-hidden"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openVideo(perf.video, perf.title, perf.image);
              }
            }}
          >
            {/* Image */}
            <img
              src={perf.image}
              alt={perf.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />

            {/* Red Border Overlay */}
            <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-red-600 transition-colors duration-300 z-20 pointer-events-none"></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Hover Content / Play Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 transition-all duration-500">
              <div className="w-16 h-16 rounded-full border border-white/50 group-hover:border-red-600 flex items-center justify-center text-white/50 group-hover:text-white mb-6 bg-transparent group-hover:bg-red-600 transition-all duration-500 group-hover:scale-110 shadow-[0_0_0px_rgba(220,38,38,0)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Title (Always visible, but enhanced on hover) */}
            <div className="absolute bottom-6 left-0 right-0 px-4 text-center z-30 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="text-white uppercase tracking-widest font-bold text-sm drop-shadow-md">
                {perf.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={closeVideo}
        videoUrl={selectedVideo?.url || ""}
        title={selectedVideo?.title || ""}
        image={selectedVideo?.image || ""}
      />
    </section>
  );
}
