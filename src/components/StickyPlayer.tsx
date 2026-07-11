"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function StickyPlayer() {
  const {
    isMainPlayerVisible,
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    closeStickyPlayer,
    hasActivePlayback,
  } = useAudioPlayer();

  const progressRef = useRef<HTMLDivElement>(null);

  const onSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      handleSeek(newTime);
    }
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {!isMainPlayerVisible && hasActivePlayback && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed z-50 bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-full md:max-w-[420px] bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden flex items-center p-3 gap-3 pr-8"
        >
          {/* Close Button */}
          <button
            onClick={closeStickyPlayer}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 transition-colors z-10"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          {/* Thumbnail */}
          <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-[#0a0a0a] overflow-hidden shadow-inner">
            <Image
              src={currentSong.image}
              alt={currentSong.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Info & Progress */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="text-white text-sm md:text-base font-bold truncate leading-tight mb-1">
              {currentSong.title}
            </div>
            <div className="text-gray-400 text-xs truncate mb-2">
              {currentSong.artist}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full text-[10px] text-gray-500 font-medium">
              <span>{formatTime(progress)}</span>
              <div
                ref={progressRef}
                onClick={onSeekClick}
                className="relative flex-1 h-[4px] bg-white/10 rounded-full cursor-pointer hover:h-[6px] transition-all group"
                aria-label="Seek progress"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={progress}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight")
                    handleSeek(Math.min(duration, progress + 5));
                  if (e.key === "ArrowLeft")
                    handleSeek(Math.max(0, progress - 5));
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-red-600 rounded-full pointer-events-none"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                {/* Thumb handle visible on hover */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progressPercentage}% - 4px)` }}
                ></div>
              </div>
              <span>-{formatTime(duration - progress)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 pr-1">
            <button
              onClick={handlePrev}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              aria-label="Previous track"
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
            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-600 hover:text-white hover:scale-105 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              aria-label="Next track"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
