"use client";

import React from "react";

export default function Header() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 h-16">
      <header className="flex items-center justify-between px-8 h-full max-w-[1440px] w-full">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleScroll(e, "hero")} className="flex-shrink-0 cursor-pointer">
          <img
            src="/assets/logo.svg"
            alt="DGC Logo"
            className="h-8 object-contain"
          />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-12 text-sm font-medium tracking-wider text-gray-300">
          <a
            href="#music"
            onClick={(e) => handleScroll(e, "music")}
            className="hover:text-white transition-colors uppercase"
          >
            MUSIC
          </a>
          <a
            href="#live"
            onClick={(e) => handleScroll(e, "live")}
            className="hover:text-white transition-colors uppercase"
          >
            LIVE
          </a>
          <a
            href="#experience"
            onClick={(e) => handleScroll(e, "experience")}
            className="hover:text-white transition-colors uppercase"
          >
            EXPERIENCE
          </a>
          <a
            href="#format"
            onClick={(e) => handleScroll(e, "format")}
            className="hover:text-white transition-colors uppercase"
          >
            FORMAT
          </a>
        </nav>

        {/* Get in touch */}
        <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="flex items-center space-x-2 text-sm font-medium tracking-wider cursor-pointer group">
          <span className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform"></span>
          <span className="uppercase text-gray-300 group-hover:text-white transition-colors">
            Get in touch
          </span>
        </a>
      </header>
    </div>
  );
}
