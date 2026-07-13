"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

const words = ["Hello", "Привет", "שלום"];

interface LoadingProps {
  onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize and track window dimensions
  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () =>
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle the word rotation and exit timing
  useEffect(() => {
    if (index === words.length) {
      // Start exit animation after showing the last word
      const timeout = setTimeout(() => {
        setIsExiting(true);
        // Call onComplete after the primary exit animation completes
        setTimeout(() => {
          setIsFinished(true);
          onComplete?.();
        }, 1200);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    // Interval between words
    const timeout = setTimeout(
      () => {
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 1200 : 1200,
    );
    return () => clearTimeout(timeout);
  }, [index, onComplete]);

  // SVG paths for the curved exit transition
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const slideUp: Variants = {
    initial: {
      top: 0,
    },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  // Content shrinks and fades out alongside the slide up
  const contentFadeOut: Variants = {
    initial: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  // Word transition animations
  const wordAnimation: Variants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const dotAnimation: Variants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  if (isFinished) return null;

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[99999]"
    >
      {/* 
        Fallback solid background.
        Visible only during SSR and initial hydration to prevent the page underneath from flashing.
      */}
      {dimension.width === 0 && (
        <div className="absolute inset-0 bg-[#000000] pointer-events-none -z-20" />
      )}

      {/* 
        Solid Black SVG Background.
        Forms the curved bottom edge when sliding up to reveal the main page.
      */}
      {dimension.width > 0 && (
        <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none -z-20">
          <motion.path
            variants={curve}
            initial="initial"
            animate={isExiting ? "exit" : "initial"}
            fill="#000000"
          />
        </svg>
      )}

      {/* 
        Red Gradient Breathing Glow.
        Layered above the black background but behind the content.
        Fades out alongside the content before the slide-up transition.
      */}
      <motion.div
        variants={contentFadeOut}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
        className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      >
        <div className="w-full h-full opacity-50 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(60,5,5,0.7)_100%)]" />
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        variants={contentFadeOut}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 
          Proportional Container:
          Keeps the text offset visually consistent relative to the image across all screen sizes.
        */}
        <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] aspect-[3/4]">
          {/* Artist Image (static) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/image/artist.webp"
                alt="Artist"
                fill
                className="object-contain"
                priority
                unoptimized
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Multilingual Greeting */}
          <div className="absolute top-[18%] sm:top-[20%] left-[80%] sm:left-[90%] md:left-[100%] flex items-center min-w-[200px] z-10">
            <div className="relative flex items-center justify-center w-2 sm:w-2.5 h-2 sm:h-2.5 mr-3 shrink-0">
              <AnimatePresence>
                {index < words.length && (
                  <motion.span
                    key={words[index]}
                    variants={dotAnimation}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="absolute block w-full h-full bg-red-600 rounded-full"
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="relative h-[60px] md:h-[80px] flex items-center flex-1">
              <AnimatePresence>
                {index < words.length && (
                  <motion.p
                    key={words[index]}
                    variants={wordAnimation}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium m-0 absolute whitespace-nowrap"
                  >
                    {words[index]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
