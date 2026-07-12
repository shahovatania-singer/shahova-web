"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const imageData = [
  { id: "06-l", type: "huge" },
  { id: "01-p", type: "portrait" },
  { id: "03-p", type: "portrait" },
  { id: "10-l", type: "landscape" },
  { id: "12-l", type: "landscape" },
  { id: "13-l", type: "landscape" },
  { id: "02-n", type: "normal" },
  { id: "07-n", type: "normal" },
  { id: "04-p", type: "portrait" },
  { id: "05-p", type: "portrait" },
  { id: "08-p", type: "portrait" },
  { id: "09-p", type: "portrait" },
  { id: "11-p", type: "portrait" },
  { id: "15-l", type: "landscape" },
  { id: "16-l", type: "landscape" },
  { id: "17-l", type: "landscape" },
  { id: "18-l", type: "landscape" },
  { id: "14-p", type: "portrait" },
];

const images = imageData.map((img) => ({
  id: img.id,
  src: `/image/${img.id}.webp`,
  alt: `Gallery image ${img.id}`,
  type: img.type,
}));

type LayoutType = "normal" | "landscape" | "portrait" | "huge";

const getBoxClass = (type: LayoutType) => {
  const base =
    "relative flex items-center justify-center overflow-hidden cursor-pointer group";
  switch (type) {
    case "huge":
      return `${base} col-span-2 row-span-1 md:col-span-4 md:row-span-2 aspect-[2/1]`;
    case "portrait":
      return `${base} col-span-1 row-span-2 aspect-[1/2]`;
    case "landscape":
      return `${base} col-span-2 row-span-1 aspect-[2/1]`;
    default:
      return `${base} col-span-1 row-span-1 aspect-square`;
  }
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIndex = selectedImage
    ? images.findIndex((img) => img.src === selectedImage)
    : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1].src);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex !== -1 && currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1].src);
    }
  };

  // Handle ESC key to close and arrows for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) setSelectedImage(images[currentIndex - 1].src);
      } else if (e.key === "ArrowRight") {
        if (currentIndex !== -1 && currentIndex < images.length - 1) {
          setSelectedImage(images[currentIndex + 1].src);
        }
      }
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, currentIndex]);

  return (
    <section
      id="gallery"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          CAPTURED MOMENTS
        </p>
      </div>

      {/* Heading */}
      <div className="mb-12 md:mb-24">
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          GALLERY
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-dense w-full">
        {images.map((img) => {
          return (
            <div
              key={img.id}
              className={getBoxClass(img.type as LayoutType)}
              onClick={() => setSelectedImage(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                className="object-cover bg-zinc-900 transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {/* Red Border Overlay */}
              <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-red-600 transition-colors duration-300 z-20 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-2xl"
                onClick={() => setSelectedImage(null)}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Prev Button */}
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Next Button */}
                {currentIndex !== -1 && currentIndex < images.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                {/* Image Container */}
                <AnimatePresence mode="wait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    key={selectedImage}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    src={selectedImage}
                    alt="Fullscreen gallery image"
                    className="max-w-[90vw] max-h-[calc(100vh-7rem)] w-auto h-auto object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking exactly on the image
                  />
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
