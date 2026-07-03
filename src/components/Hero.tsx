import React from "react";
import Carousel from "@/components/Carousel";

export default function Hero() {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center w-full z-10 pt-32 pb-20 min-h-screen">
      {/* Red Edge Shadow Left */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-red-600/40 to-transparent z-40 pointer-events-none" />

      {/* Red Edge Shadow Right */}
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-red-600/40 to-transparent z-40 pointer-events-none" />

      {/* Huge Title */}
      <div className="relative z-30 px-4 w-full text-center mb-8 mt-auto">
        <h1
          className="text-[12vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw] xl:text-[8.5vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
          style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.5)" }}
        >
          Shahova
        </h1>
      </div>

      {/* Carousel */}
      <div className="mb-auto w-full flex flex-col items-center">
        <Carousel />
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase mt-6 text-center">
          CLICK ANY CARD TO PLAY
        </p>
      </div>
    </section>
  );
}
