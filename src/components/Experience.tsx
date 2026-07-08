import React from "react";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Top Label */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          MORE THAN MUSIC — A MOMENT TO REMEMBER
        </p>
      </div>

      {/* Heading */}
      <div className="mb-12 md:mb-24">
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          EXPERIENCE
        </h2>
      </div>

      {/* Content Columns */}
      <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center lg:items-stretch w-full">
        {/* Left Column - Image Stack */}
        <div className="relative w-full md:w-[80%] lg:w-[55%] flex-shrink-0 flex flex-col">
          {/* Third Layer */}
          <div className="absolute top-0 bottom-0 w-full translate-x-[32px] z-0 overflow-hidden border-l-[4px] border-[#0d0d0d]">
            <img
              src="/image/Experience.webp"
              alt=""
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale"
            />
          </div>

          {/* Second Layer */}
          <div className="absolute top-0 bottom-0 w-full translate-x-[16px] z-10 overflow-hidden border-l-[4px] border-[#0d0d0d]">
            <img
              src="/image/Experience.webp"
              alt=""
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale"
            />
          </div>

          {/* Main Image */}
          <div className="relative z-20 w-full aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] bg-zinc-900 overflow-hidden shadow-[0px_0px_50px_rgba(0,0,0,0.5)]">
            <img
              src="/image/Experience.webp"
              alt="Cameraman in action"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column - List */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center gap-14 mt-8 lg:mt-0 py-4">
          {/* Item 1 */}
          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-black tracking-widest text-lg mb-1">
              01
            </span>
            <h3 className="text-[3.5vw] sm:text-lg md:text-xl lg:text-lg xl:text-xl font-black leading-[0.85] tracking-tighter uppercase [word-spacing:0.15em]">
              LIVE MUSIC THAT ELEVATE EVERY EVENT
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-snug">
              Elegant performances for unforgettable celebrations
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-black tracking-widest text-lg mb-1">
              02
            </span>
            <h3 className="text-[3.5vw] sm:text-lg md:text-xl lg:text-lg xl:text-xl font-black leading-[0.85] tracking-tighter uppercase [word-spacing:0.15em]">
              FLEXIBLE PERFORMANCE FORMATS
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-snug">
              Solo, Duo, Trio or Full Live Band
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-black tracking-widest text-lg mb-1">
              03
            </span>
            <h3 className="text-[3.5vw] sm:text-lg md:text-xl lg:text-lg xl:text-xl font-black leading-[0.85] tracking-tighter uppercase [word-spacing:0.15em]">
              PROFESSIONALISM YOU CAN RELY ON
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-snug">
              Exceptional vocals, premium sound and an engaging stage presence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
