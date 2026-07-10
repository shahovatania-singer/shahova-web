"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SONGS } from "@/constants/songs";

interface AudioPlayerContextType {
  activeIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isMainPlayerVisible: boolean;
  setIsMainPlayerVisible: (visible: boolean) => void;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSeek: (newTime: number) => void;
  pauseMusic: () => void;
  closeStickyPlayer: () => void;
  hasActivePlayback: boolean;
  currentSong: typeof SONGS[0];
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMainPlayerVisible, setIsMainPlayerVisible] = useState(true);
  const [hasActivePlayback, setHasActivePlayback] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize duration if metadata is already loaded
  useEffect(() => {
    if (audioRef.current && audioRef.current.readyState >= 1) {
      setDuration(audioRef.current.duration);
    }
  }, [activeIndex]);

  // Play/Pause effect
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setHasActivePlayback(true);
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
    if (isPlaying && isMainPlayerVisible) {
      setHasActivePlayback(false);
    } else if (!isPlaying) {
      setHasActivePlayback(true);
    }
    setIsPlaying(!isPlaying);
  };

  const pauseMusic = () => {
    setIsPlaying(false);
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

  const handleSeek = (newTime: number) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const closeStickyPlayer = () => {
    setIsPlaying(false);
    setProgress(0);
    setHasActivePlayback(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const currentSong = SONGS[activeIndex];

  return (
    <AudioPlayerContext.Provider
      value={{
        activeIndex,
        isPlaying,
        progress,
        duration,
        isMainPlayerVisible,
        setIsMainPlayerVisible,
        togglePlay,
        handleNext,
        handlePrev,
        handleSeek,
        pauseMusic,
        closeStickyPlayer,
        hasActivePlayback,
        currentSong,
      }}
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
