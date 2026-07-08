"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FORMATS = [
  {
    id: "solo",
    title: "Solo",
    subtitle: "One Voice",
    thumbnail: "/image/Solo.webp",
    mainImage: "/image/Solo.webp",
    details: (
      <>
        <p className="text-red-600 uppercase tracking-widest text-sm font-semibold mb-2">
          Live Elegance
        </p>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          SOLO
        </h3>
        <p className="mb-4 text-gray-300 leading-relaxed text-lg">
          As a solo performer, I provide live entertainment for a wide range of events and occasions.
        </p>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          My repertoire includes Jazz, Soul, Pop, Latin, Disco and world-famous hits.
          <br />
          Performing live at restaurants, private events, weddings, corporate events, and special occasions.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Solo Show
        </h4>
        <p className="mb-6 text-gray-300 leading-relaxed text-lg">
          A complete vocal performance tailored to your event, audience, and atmosphere.
          I create a personalized program and perform with high-quality backing tracks.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Guest Vocalist
        </h4>
        <p className="mb-6 text-gray-300 leading-relaxed text-lg">
          Available as a guest vocalist for concert programs, orchestras, and live bands,
          adding a professional vocal performance to larger musical projects.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Studio Work
        </h4>
        <p className="text-gray-300 leading-relaxed text-lg">
          I also work as a studio vocalist for recording projects, collaborations, and original music productions.
        </p>
      </>
    ),
  },
  {
    id: "duo",
    title: "Duo",
    subtitle: "Vocals & Violin",
    thumbnail: "/image/Duo.webp",
    mainImage: "/image/Duo.webp",
    details: (
      <>
        <p className="text-red-600 uppercase tracking-widest text-sm font-semibold mb-2">
          Duo Performance — Vocal + Violin
        </p>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          DUO
        </h3>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          Our duo combines live vocals with high-quality music arrangements and
          the beautiful sound of the violin, creating a stylish, elegant, and
          welcoming atmosphere for your guests.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Our repertoire includes:
        </h4>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          Jazz, Soul, Pop, Lounge, Latino, and internationally loved classics,
          carefully selected to complement the atmosphere while making every
          event feel memorable and unique.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          This format is perfect for:
        </h4>
        <p className="text-gray-300 leading-relaxed text-lg">
          wedding receptions and guest welcomes, cocktail hours, wine evenings,
          lounge cafés, fine dining restaurants, museums, art galleries, private
          celebrations, corporate events, hotel lounges, boutique venues, and
          other sophisticated occasions.
        </p>
      </>
    ),
  },
  {
    id: "trio",
    title: "Trio",
    subtitle: "Vocals & Percussion",
    thumbnail: "/image/Trio.webp",
    mainImage: "/image/Trio.webp",
    details: (
      <>
        <p className="text-red-600 uppercase tracking-widest text-sm font-semibold mb-2">
          Trio — Vocal, Piano, Violin & Percussion
        </p>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          TRIO
        </h3>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          Golden notes Trio is an elegant blend of live vocals, piano, violin,
          and percussion instruments (congas, cajón, and more), creating a
          refined and unforgettable musical experience.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          The repertoire:
        </h4>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          Bossa Nova, Jazz, Swing, Pop, Latin and Lounge favorites.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Perfect for:
        </h4>
        <p className="text-gray-300 leading-relaxed text-lg">
          restaurants, cafés, bars, and venues looking for sophisticated
          background music with a warm and elegant vibe.
        </p>
      </>
    ),
  },
  {
    id: "full-band",
    title: "Full Band",
    subtitle: "Grand Performance",
    thumbnail: "/image/Full BandF.webp",
    mainImage: "/image/Full BandF.webp",
    details: (
      <>
        <p className="text-red-600 uppercase tracking-widest text-sm font-semibold mb-2">
          Experience
        </p>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          FULL BAND
        </h3>
        <p className="mb-4 text-gray-300 leading-relaxed text-lg">
          A powerful, high-energy live show featuring a full professional band,
          designed for complete concert programs and unforgettable live
          entertainment, delivering a rich, dynamic sound, strong stage
          presence, and an engaging performance that keeps audiences entertained
          from beginning to end.
        </p>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          This format creates an exciting atmosphere where guests can dance,
          sing along, and fully enjoy the energy and vibe of live music.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Line-up:
        </h4>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          Vocals • Piano • Guitar • Bass • Drums
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          The repertoire:
        </h4>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          combines internationally loved hits with original music, featuring
          Pop, Dance, Funk, Soul, Disco, Latino, Jazz, and modern chart
          favorites.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Perfect for:
        </h4>
        <p className="text-gray-300 leading-relaxed text-lg">
          large-scale events, weddings, festivals, corporate events, city
          celebrations, private parties, hotel entertainment, restaurants,
          clubs, and concert venues.
        </p>
      </>
    ),
  },
];

export default function Format() {
  const [stackOrder, setStackOrder] = useState([
    "solo",
    "duo",
    "trio",
    "full-band",
  ]);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  useEffect(() => {
    if (activePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activePopup]);

  const handleSelect = (id: string) => {
    setStackOrder((prev) => {
      const newStack = prev.filter((item) => item !== id);
      newStack.unshift(id); // Move selected to the front
      return newStack;
    });
  };

  return (
    <section
      id="format"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          DESIGNED FOR EVERY VISION
        </p>
      </div>

      {/* Heading */}
      <div className="mb-12 md:mb-24">
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          SHOW FORMAT
        </h2>
      </div>

      {/* Content Columns */}
      <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center lg:items-stretch w-full">
        {/* Left Column - List */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4">
          {FORMATS.map((format) => {
            const isSelected = stackOrder[0] === format.id;

            return (
              <div
                key={format.id}
                onClick={() => !isSelected && handleSelect(format.id)}
                className={`flex items-center gap-4 md:gap-6 p-3 md:p-4 transition-all duration-300 border ${
                  isSelected
                    ? "border-red-600 bg-red-600/5 cursor-default"
                    : "border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className={`w-16 h-16 md:w-24 md:h-24 bg-zinc-800 overflow-hidden flex-shrink-0 transition-all duration-300 ${!isSelected ? "grayscale opacity-50" : ""}`}
                >
                  <img
                    src={format.thumbnail}
                    alt={format.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <span
                    className={`text-2xl md:text-4xl font-black leading-[0.85] tracking-tighter uppercase transition-colors truncate ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {format.title}
                  </span>

                  {isSelected && (
                    <div className="flex items-center justify-between mt-2 md:mt-3 md:pr-4">
                      <span className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
                        {format.subtitle}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePopup(format.id);
                        }}
                        // className="text-xs md:text-lg font-medium tracking-widest text-white hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                        className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                      >
                        MORE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Image Stack */}
        <div className="relative w-full md:w-[80%] lg:w-[55%] aspect-[16/10] lg:aspect-auto flex-shrink-0 pr-12">
          {FORMATS.map((format) => {
            const index = stackOrder.indexOf(format.id);
            const isFront = index === 0;

            return (
              <motion.div
                key={format.id}
                layout
                initial={false}
                animate={{
                  x: index * 32, // Shift right
                  zIndex: 30 - index * 10,
                  opacity: isFront ? 1 : 0.8 - index * 0.2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute inset-0 bottom-0 overflow-hidden shadow-[0px_0px_50px_rgba(0,0,0,0.5)] bg-zinc-900 ${
                  !isFront
                    ? "border-l-[4px] border-[#0d0d0d] grayscale mix-blend-luminosity"
                    : ""
                }`}
                style={{ right: "48px" }} // Make room for the shifted back elements
              >
                <img
                  src={format.mainImage}
                  alt={format.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center px-4 pb-4 pt-20 bg-black/60 backdrop-blur-2xl"
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <button
                onClick={() => setActivePopup(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                aria-label="Close"
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

              <div className="mt-2 pr-4">
                {FORMATS.find((f) => f.id === activePopup)?.details}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
