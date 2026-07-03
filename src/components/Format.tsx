"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const FORMATS = [
  {
    id: "solo",
    title: "Solo",
    thumbnail: "https://images.unsplash.com/photo-1516280440503-6c84c1a8e23f?q=80&w=200&auto=format&fit=crop",
    mainImage: "https://images.unsplash.com/photo-1516280440503-6c84c1a8e23f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "trio",
    title: "Trio",
    thumbnail: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=200&auto=format&fit=crop",
    mainImage: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2076&auto=format&fit=crop",
  },
  {
    id: "live-band",
    title: "Live Band",
    thumbnail: "https://images.unsplash.com/photo-1574691444146-24a9a06782ff?q=80&w=200&auto=format&fit=crop",
    mainImage: "https://images.unsplash.com/photo-1574691444146-24a9a06782ff?q=80&w=2070&auto=format&fit=crop",
  }
];

export default function Format() {
  const [stackOrder, setStackOrder] = useState(["trio", "solo", "live-band"]);

  const handleSelect = (id: string) => {
    setStackOrder((prev) => {
      const newStack = prev.filter((item) => item !== id);
      newStack.unshift(id); // Move selected to the front
      return newStack;
    });
  };

  return (
    <section id="format" className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20">
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          DESIGNED FOR EVERY VISION
        </p>
      </div>

      {/* Heading */}
      <div className="mb-24">
        <h2 
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          SHOW FORMAT
        </h2>
      </div>

      {/* Content Columns */}
      <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center lg:items-start w-full">
        
        {/* Left Column - List */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 mt-8 lg:mt-0">
          {FORMATS.map((format) => {
            const isSelected = stackOrder[0] === format.id;
            
            return (
              <div 
                key={format.id}
                onClick={() => handleSelect(format.id)}
                className={`flex items-center gap-8 p-4 cursor-pointer transition-all duration-300 border ${
                  isSelected 
                    ? "border-red-600 bg-red-600/5" 
                    : "border-transparent hover:border-white/10 hover:bg-white/5"
                }`}
              >
                {/* Thumbnail */}
                <div className={`w-24 h-24 bg-zinc-800 overflow-hidden flex-shrink-0 transition-all duration-300 ${!isSelected ? "grayscale opacity-50" : ""}`}>
                  <img src={format.thumbnail} alt={format.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Text */}
                <div className="flex flex-col">
                  <span className={`text-2xl font-bold tracking-wider transition-colors ${
                    isSelected ? "text-white" : "text-gray-400"
                  }`}>
                    {format.title}
                  </span>
                  {isSelected && (
                    <motion.div 
                      layoutId="activeIndicator" 
                      className="h-[2px] bg-white mt-3 w-12"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Image Stack */}
        <div className="relative w-full md:w-[80%] lg:w-[55%] aspect-[16/10] flex-shrink-0 pr-12">
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
                  opacity: isFront ? 1 : 0.8 - (index * 0.2),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute inset-0 bottom-0 overflow-hidden shadow-[0px_0px_50px_rgba(0,0,0,0.5)] bg-zinc-900 ${
                  !isFront ? "border-l-[4px] border-[#0d0d0d] grayscale mix-blend-luminosity" : ""
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
    </section>
  );
}
