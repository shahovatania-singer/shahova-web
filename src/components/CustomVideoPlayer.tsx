"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomVideoPlayerProps {
  url: string;
  onClose: () => void;
  isVertical?: boolean;
  imageUrl?: string;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

export default function CustomVideoPlayer({
  url,
  onClose,
  isVertical,
  imageUrl,
}: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      resetControlsTimeout();
    };

    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 2500);
    };

    resetControlsTimeout();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing]);

  useEffect(() => {
    if (playerRef.current && isReady) {
      if (playing) {
        playerRef.current.play().catch(console.error);
      } else {
        playerRef.current.pause();
      }
    }
  }, [playing, isReady]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => setPlaying(!playing);
  const handleMute = () => setMuted(!muted);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.currentTime = newPlayed * duration;
    }
  };

  const handleToggleFullscreen = () => {
    const wrapper = document.getElementById("video-player-wrapper");
    if (!document.fullscreenElement) {
      wrapper?.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.currentTarget;
    if (target.duration) {
      setPlayed(target.currentTime / target.duration);
    }
  };

  const handleDurationChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  return (
    <div
      id="video-player-wrapper"
      className="relative flex items-center justify-center overflow-hidden group/wrapper bg-black"
    >
      {/* Loading Indicator */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* The Player */}
      {hasMounted && (
        <video
          ref={playerRef}
          src={url}
          className={`block max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
          muted={muted}
          autoPlay
          onCanPlay={() => setIsReady(true)}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={() => setPlaying(false)}
          playsInline
        />
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 cursor-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handlePlayPause();
        }}
      >
        {/* Top bar */}
        <div className="w-full flex justify-end p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 transition-colors text-white hover:text-red-600 pointer-events-auto shadow-lg"
            aria-label="Close video"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Big Center Play Button (if paused) */}
        {!playing && isReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              className="w-24 h-24 flex items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_40px_rgba(220,38,38,0.6)] pointer-events-auto hover:scale-110 transition-transform backdrop-blur-sm"
              onClick={handlePlayPause}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom bar */}
        <div className="w-full p-6 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-4 pointer-events-none">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full relative cursor-pointer group pointer-events-auto">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Filled Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full pointer-events-none"
              style={{ width: `${played * 100}%` }}
            ></div>
            {/* Thumb on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${played * 100}% - 8px)` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white pointer-events-auto">
            <div className="flex items-center gap-6">
              <button
                onClick={handlePlayPause}
                className="hover:text-red-500 transition-colors"
              >
                {playing ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleMute}
                className="hover:text-red-500 transition-colors"
              >
                {muted ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>

              <div className="text-sm font-medium tracking-widest text-gray-300 ml-1 font-mono">
                {formatTime(played * duration)} / {formatTime(duration)}
              </div>
            </div>

            <div>
              <button
                onClick={handleToggleFullscreen}
                className="hover:text-red-500 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
