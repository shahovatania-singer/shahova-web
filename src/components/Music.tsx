"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SONGS = [
  {
    id: 1,
    title: "Summer",
    artist: "Featured Track",
    image: "/image/Summer clip.webp",
    src: "/sound/Summer.MP3",
  },
  {
    id: 2,
    title: "Parlo Miro",
    artist: "Featured Track",
    image: "/image/Parlo miro clip.webp",
    src: "/sound/Parlo Miro.MP3",
  },
  {
    id: 3,
    title: "Hypnotize",
    artist: "Featured Track",
    image: "/image/Hypnotize clip.webp",
    src: "/sound/Hypnotize.MP3",
  },
  {
    id: 4,
    title: "Moonlight",
    artist: "Featured Track",
    image: "/image/Moonlight.webp",
    src: "/sound/Moonlight.MP3",
  },
  {
    id: 5,
    title: "Sway",
    artist: "Featured Track",
    image: "/image/Sway.webp",
    src: "/sound/Sway.MP3",
  },
  {
    id: 6,
    title: "Let It Snow",
    artist: "Featured Track",
    image: "/image/Let It Snow.webp",
    src: "/sound/Let It Snow.MP3",
  },
  {
    id: 7,
    title: "Tainted Love",
    artist: "Featured Track",
    image: "/image/Tainted Love clip.webp",
    src: "/sound/Tainted Love.MP3",
  },
];

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export default function Music() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Play/Pause effect
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log("Audio play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SONGS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const currentSong = SONGS[activeIndex];
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <section
      id="music"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20 overflow-hidden"
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Heading */}
      <div className="mb-12 md:mb-24 z-20">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase mb-4">
          Listen to her journey
        </p>
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          MUSIC
        </h2>
      </div>

      {/* Carousel & Player Area */}
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* 3D Carousel */}
        <div className="relative w-full max-w-5xl h-[450px] md:h-[600px] lg:h-[650px] flex items-center justify-center">
          {SONGS.map((song, index) => {
            let offset = index - activeIndex;
            if (offset < -Math.floor(SONGS.length / 2)) offset += SONGS.length;
            if (offset > Math.floor(SONGS.length / 2)) offset -= SONGS.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2; // Allow more cards to be visible

            return (
              <motion.div
                key={song.id}
                initial={false}
                animate={{
                  x: `${offset * 105}%`,
                  scale: isCenter ? 1 : 0.65,
                  opacity: isVisible ? (isCenter ? 1 : 0.4) : 0,
                  zIndex: 30 - Math.abs(offset) * 10,
                  filter: isCenter
                    ? "grayscale(0%) brightness(1)"
                    : "grayscale(80%) brightness(0.6)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-[80%] md:w-[450px] flex flex-col items-center pointer-events-none"
              >
                {/* Card Image */}
                <div className="w-full aspect-[3/4] bg-[#0a0a0a] overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <img
                    src={song.image}
                    alt={song.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${isCenter ? "opacity-100" : "opacity-60"}`}
                  />

                  {/* Red border & dot for inactive cards */}
                  {!isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 flex justify-center items-center">
                      <div className="w-2 h-2 rounded-full border-[2px] border-red-600 bg-[#0d0d0d]"></div>
                    </div>
                  )}
                </div>

                {/* Inactive Card Info below image */}
                <motion.div
                  animate={{ opacity: isCenter ? 0 : 1 }}
                  className="w-full text-center flex flex-col items-center mt-6"
                >
                  <span className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">
                    {song.artist}
                  </span>
                  <span className="text-xs text-gray-300 uppercase tracking-widest">
                    {song.title}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Player UI */}
        <div className="mt-0 md:-mt-2 flex flex-col items-center w-full max-w-md z-30 relative">
          <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">
            {currentSong.artist}
          </div>
          <div className="text-sm md:text-base text-gray-200 font-medium mb-8 tracking-widest uppercase">
            {currentSong.title}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 w-full text-xs text-gray-500 font-medium mb-8 px-4">
            <span className="w-8 text-right text-gray-300">
              {formatTime(progress)}
            </span>
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="relative flex-1 h-[4px] bg-white/10 rounded-full cursor-pointer hover:h-[6px] transition-all"
            >
              {/* Filled part */}
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full pointer-events-none"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              {/* Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] pointer-events-none"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
              ></div>
            </div>
            <span className="w-8 text-left text-gray-300">
              -{formatTime(duration - progress)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-12">
            {/* Prev */}
            <button
              onClick={handlePrev}
              className="text-gray-400 hover:text-white hover:scale-110 transition-all p-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 24V0L6 12l16 12z M2 0h4v24H2z" />
              </svg>
            </button>
            {/* Play */}
            <button
              onClick={togglePlay}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 hover:scale-105 transition-all shadow-lg"
            >
              {isPlaying ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            {/* Next */}
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white hover:scale-110 transition-all p-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 24V0l16 12L2 24z M22 0h-4v24h4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
