import React from "react";

export default function About() {
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
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start w-full">
        {/* Left Column - Image Stack */}
        <div className="relative w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex-shrink-0 flex flex-col">
          {/* Third Layer */}
          <div className="absolute top-0 bottom-0 w-full translate-x-[32px] z-0 overflow-hidden border-l-[4px] border-[#0d0d0d]">
            <img
              src="/image/About.webp"
              alt=""
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale"
            />
          </div>

          {/* Second Layer */}
          <div className="absolute top-0 bottom-0 w-full translate-x-[16px] z-10 overflow-hidden border-l-[4px] border-[#0d0d0d]">
            <img
              src="/image/About.webp"
              alt=""
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale"
            />
          </div>

          {/* Main Image */}
          <div className="relative z-20 w-full aspect-[4/5] bg-zinc-900 overflow-hidden shadow-[0px_0px_50px_rgba(0,0,0,0.5)]">
            <img
              src="/image/About.webp"
              alt="About the artist"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column - Text */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6 mt-8 lg:mt-0 py-4 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-medium">
          <p>
            I am <strong className="text-white font-bold">SHAHOVA</strong> — a singer, songwriter, and live performer, creating elegant live music for weddings, private celebrations, corporate events, and exclusive occasions.
          </p>
          <p>
            Known for emotionally rich vocals, refined stage presence, and genuine connection with every audience, I believe that live music should never be just background—it should become one of the most memorable parts of your event.
          </p>
          <p>
            Alongside performing, I write original music in <strong className="text-white font-bold">English</strong>, <strong className="text-white font-bold">Ukrainian</strong>, and <strong className="text-white font-bold">Spanish</strong>, with more than <strong className="text-white font-bold">20 original songs</strong> released and written for both my own projects and other artists.
          </p>
          <p>
            In <strong className="text-white font-bold">2025</strong>, my original song <strong className="text-white font-bold">Moonlight</strong> received <strong className="text-white font-bold">1st Place</strong> at the <strong className="text-white font-bold">London Songwriting Competition</strong>, while both the song and its official music video gained international recognition.
          </p>
          <p>
            Every performance is thoughtfully tailored to the atmosphere of the occasion, creating an elegant musical experience that brings people together and leaves lasting memories long after the final note.
          </p>
        </div>
      </div>
    </section>
  );
}
