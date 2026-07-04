"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      // Wait for the mobile menu exit animation (300ms) to finish before scrolling
      // This prevents the browser from aborting the smooth scroll due to layout shifts.
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const navLinks = [
    { id: "music", label: "MUSIC" },
    { id: "live", label: "LIVE" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "format", label: "FORMAT" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5">
      <header className="flex items-center justify-between px-6 sm:px-8 h-16 max-w-[1440px] w-full">
        {/* Logo */}
        <a 
          href="#hero" 
          onClick={(e) => handleScroll(e, "hero")} 
          className="flex-shrink-0 cursor-pointer"
        >
          <img
            src="/assets/logo.svg"
            alt="DGC Logo"
            className="h-8 object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12 text-sm font-medium tracking-wider text-gray-300">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="hover:text-white transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: Get in touch & Mobile Menu Toggle */}
        <div className="flex items-center space-x-5 sm:space-x-8">
          <a 
            href="#contact" 
            onClick={(e) => handleScroll(e, "contact")} 
            className="hidden md:flex items-center space-x-2 text-[10px] sm:text-sm font-medium tracking-wider cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform"></span>
            <span className="uppercase text-gray-300 group-hover:text-white transition-colors">
              Get in touch
            </span>
          </a>

          {/* Burger Menu Button (Mobile) */}
          <button
            className="md:hidden relative w-6 h-6 flex items-center justify-center focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
              className="absolute w-6 h-[2px] bg-gray-300"
            />
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="absolute w-6 h-[2px] bg-gray-300"
            />
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
              className="absolute w-6 h-[2px] bg-gray-300"
            />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full overflow-hidden bg-[#0d0d0d]/95 backdrop-blur-lg border-t border-white/5"
          >
            <div className="flex flex-col items-center py-8 space-y-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                  className="text-lg font-semibold tracking-widest text-gray-300 hover:text-white uppercase transition-colors"
                >
                  {link.label}
                </a>
              ))}
              
              <a 
                href="#contact" 
                onClick={(e) => handleScroll(e, "contact")} 
                className="flex items-center space-x-3 text-lg font-semibold tracking-widest cursor-pointer group"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform"></span>
                <span className="uppercase text-gray-300 group-hover:text-white transition-colors">
                  Get in touch
                </span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
