"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import CustomVideoPlayer from "./CustomVideoPlayer";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  image?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title, image }: VideoModalProps) {
  const [mounted, setMounted] = useState(false);
  const { pauseMusic, isPlaying } = useAudioPlayer();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      if (isPlaying) {
        pauseMusic();
      }
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isPlaying, pauseMusic]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="relative w-fit h-fit max-w-[95vw] max-h-[90vh] bg-[#0a0a0a] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.15)] ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomVideoPlayer url={videoUrl} onClose={onClose} imageUrl={image} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
