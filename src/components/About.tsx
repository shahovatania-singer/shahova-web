"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [showAward, setShowAward] = useState(false);

  return (
    <section
      id="about"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Top Label */}
      <div className="mb-6 z-20">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          Meet the artist
        </p>
      </div>

      {/* Heading */}
      <div className="mb-12 md:mb-24 z-20">
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          ABOUT
        </h2>
      </div>

      {/* Content Columns */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-stretch items-center w-full">
        {/* Left Column - Image */}
        <div className="relative w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex-shrink-0 flex flex-col">
          <div className="relative w-full aspect-[4/5] flex-grow bg-zinc-900 overflow-hidden shadow-[0px_0px_50px_rgba(0,0,0,0.5)]">
            <img
              src="/image/About.webp"
              alt="About the artist"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column - Text */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center gap-6 mt-8 lg:mt-0 py-4 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-medium">
          <p>
            I am <strong className="text-white font-bold">SHAHOVA</strong> — a
            singer, songwriter, and live performer, creating elegant live music
            for weddings, private celebrations, corporate events, and exclusive
            occasions.
          </p>
          <p>
            Known for emotionally rich vocals, refined stage presence, and
            genuine connection with every audience, I believe that live music
            should never be just background — it should become one of the most
            memorable parts of your event.
          </p>
          <p>
            Alongside performing, I write original music in{" "}
            <strong className="text-white font-bold">English</strong>,{" "}
            <strong className="text-white font-bold">Ukrainian</strong>, and{" "}
            <strong className="text-white font-bold">Spanish</strong>, with more
            than{" "}
            <strong className="text-white font-bold">20 original songs</strong>{" "}
            released and written for both my own projects and other artists.
          </p>
          <p>
            In <strong className="text-white font-bold">2025</strong>, my
            original song{" "}
            <strong className="text-white font-bold">Moonlight</strong> received{" "}
            <span
              className="cursor-pointer group"
              onClick={() => setShowAward(true)}
            >
              <strong className="text-white font-bold group-hover:text-red-600 transition-colors duration-300">
                1st Place
              </strong>
              <span className="group-hover:text-red-600 transition-colors duration-300">
                {" at the "}
              </span>
              <strong className="text-white font-bold group-hover:text-red-600 transition-colors duration-300">
                London Songwriting Competition
              </strong>
            </span>
            , while both the song and its official music video gained
            international recognition.
          </p>
          <p>
            Every performance is thoughtfully tailored to the atmosphere of the
            occasion, creating an elegant musical experience that brings people
            together and leaves lasting memories long after the final note.
          </p>
        </div>
      </div>

      {/* Award Modal */}
      <AnimatePresence>
        {showAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 pb-4 pt-20 bg-black/60 backdrop-blur-2xl"
            onClick={() => setShowAward(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAward(false)}
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

              <div className="mt-4">
                <img
                  src="/image/Award.webp"
                  alt="London Songwriting Competition Award"
                  className="w-full h-auto object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
