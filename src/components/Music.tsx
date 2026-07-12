"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SONGS } from "@/constants/songs";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function Music() {
  const {
    activeIndex,
    isPlaying,
    progress,
    duration,
    setIsMainPlayerVisible,
    togglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    currentSong,
  } = useAudioPlayer();

  const sectionRef = useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  useEffect(() => {
    // If IntersectionObserver hasn't fired yet, default to visible.
    const isVisible = entry ? entry.isIntersecting : true;
    setIsMainPlayerVisible(isVisible);
  }, [entry, setIsMainPlayerVisible]);

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <section
      ref={sectionRef}
      id="music"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20 overflow-hidden"
    >
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
        <div className="relative w-full max-w-5xl h-[450px] sm:h-[500px] md:h-[600px] lg:h-[650px] flex items-center justify-center">
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
                className="absolute w-[70vw] max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[450px] flex flex-col items-center pointer-events-none"
              >
                {/* Card Image */}
                <div className="w-full aspect-[3/4] bg-[#0a0a0a] overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <Image
                    src={song.image}
                    alt={song.title}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 450px"
                    className={`object-cover transition-all duration-700 ${isCenter ? "opacity-100" : "opacity-60"}`}
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
        <div className="-mt-6 md:-mt-2 flex flex-col items-center w-full z-30 relative">
          <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">
            {currentSong.artist}
          </div>
          <div className="text-lg md:text-xl font-black leading-[0.85] tracking-tighter uppercase [word-spacing:0.15em] mb-8">
            {currentSong.title}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 w-full max-w-md text-xs text-gray-500 font-medium mb-3 md:mb-4 px-4">
            <span className="w-8 text-right text-gray-300">
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-[4px] bg-white/10 rounded-full cursor-pointer hover:h-[6px] transition-all group">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step="any"
                value={progress}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Seek progress"
              />
              {/* Filled part */}
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full pointer-events-none"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              {/* Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercentage}% - 4px)` }}
              ></div>
            </div>
            <span className="w-8 text-left text-gray-300">
              -{formatTime(duration - progress)}
            </span>
          </div>

          {/* Bottom Area: Controls & Links */}
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center mt-2 md:mt-0 px-4 md:px-0 min-h-[100px]">
            {/* Controls Block */}
            <div className="flex items-center justify-center gap-12 mb-12 md:mb-0">
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

            {/* External Links Block */}
            <div className="md:absolute md:left-0 md:top-1/2 md:-translate-y-[70px] flex flex-row md:flex-col justify-center md:justify-start gap-8 md:gap-4 items-center md:items-start w-full md:w-auto z-40">
              {/* Apple Music */}
              <a
                href="https://music.apple.com/us/artist/shahova/1525596894"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white hover:text-red-600 transition-colors duration-300 w-fit"
                aria-label="Apple Music"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z" />
                </svg>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                  Apple Music
                </span>
              </a>
              {/* Spotify */}
              <a
                href="https://open.spotify.com/user/31rdxmipck6slsyi2imcyt46mk3u?si=IFRny4phQxW-WXnL27nJcg&utm_source=native-share-menu"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white hover:text-red-600 transition-colors duration-300 w-fit"
                aria-label="Spotify"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.44-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.261 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                  Spotify
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
