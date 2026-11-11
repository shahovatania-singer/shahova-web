"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, frame, cancelFrame } from "framer-motion";
import Reveal from "./Reveal";
import FormatVideo from "./FormatVideo";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useRevealArmed } from "@/hooks/useRevealArmed";

/**
 * Below `lg` the list and the photo can't sit side by side, so instead of the
 * image stack each format opens its own photo directly beneath its row, like a
 * dropdown. Switching formats collapses the old photo and opens the new one in
 * the same transition, so the list's total height stays constant.
 */
const PANEL_MS = 450;
const PANEL_TRANSITION = {
  duration: PANEL_MS / 1000,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Tailwind's `lg` — where the side-by-side layout takes over. */
const DESKTOP_QUERY = "(min-width: 64rem)";

/** The fixed header is `h-16`; a selected row should settle clear of it. */
const HEADER_HEIGHT = 64;
const HEADER_CLEARANCE = HEADER_HEIGHT + 16;

/** Breathing room between an opened photo and the bottom of the viewport. */
const BOTTOM_GAP = 16;

/**
 * Keeps a just-selected format in view while the photos resize.
 *
 * Picking a format below the open one collapses the photo above it, which
 * drags the selected row upward — on a phone, far enough to slide it under the
 * header or off the screen. For the length of the transition this nudges the
 * page so the row never rises above the header, and scrolls down to reveal the
 * opening photo if it would end below the fold. The row is otherwise left to
 * move naturally. It runs in framer-motion's postRender step so it measures the
 * heights framer has just written rather than last frame's, and gives way as
 * soon as the reader scrolls.
 *
 * It stops once the transition time is up *and* the layout has stopped moving,
 * not on a timer alone: on a slow phone a dropped frame can land the final
 * height after the nominal end, and that last jump is the one that matters.
 *
 * Returns a function that stops it early.
 */
function followSelection(item: HTMLElement): () => void {
  const start = performance.now();
  let lastTop = NaN;
  let lastHeight = NaN;

  const step = () => {
    if (!item.isConnected) return stop();

    const { top, bottom } = item.getBoundingClientRect();
    const overflow = bottom - (window.innerHeight - BOTTOM_GAP);

    let dy = 0;
    if (top < HEADER_CLEARANCE) dy = top - HEADER_CLEARANCE;
    else if (overflow > 0) dy = Math.min(overflow, top - HEADER_CLEARANCE);

    // "instant" overrides the `scroll-behavior: smooth` set on <html>.
    if (dy !== 0) window.scrollBy({ top: dy, behavior: "instant" });

    // offsetTop/offsetHeight are layout positions, unaffected by the scroll
    // above, so they only stop changing once the photos have finished resizing.
    const settled =
      item.offsetTop === lastTop && item.offsetHeight === lastHeight;
    lastTop = item.offsetTop;
    lastHeight = item.offsetHeight;

    const elapsed = performance.now() - start;
    if ((elapsed > PANEL_MS && settled) || elapsed > PANEL_MS + 1000) stop();
  };

  const stop = () => {
    cancelFrame(step);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("touchmove", stop);
  };

  frame.postRender(step, true);
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  // touchmove as well: when the sequence moves on by itself, a finger may
  // already be down and dragging.
  window.addEventListener("touchmove", stop, { passive: true });
  return stop;
}

/**
 * The section counts as active while it overlaps the middle half of the
 * viewport. Measured against the viewport rather than as a share of the
 * section, so it means the same thing on a phone, where the list is taller
 * than the screen, as on a desktop.
 */
const ACTIVE_BAND = "-25% 0px -25% 0px";

/** Whether at least half of an element is on screen, below the header. */
function isMostlyOnScreen(el: HTMLElement) {
  const { top, bottom, height } = el.getBoundingClientRect();
  if (height === 0) return false;
  const visible =
    Math.min(bottom, window.innerHeight) - Math.max(top, HEADER_HEIGHT);
  return visible >= height / 2;
}

/**
 * The box the section's single <video> lives in (see the note in Format). It
 * is created outside React's tree so it can be carried from one photo to
 * another without the element inside being torn down.
 */
function createVideoHost() {
  if (typeof document === "undefined") return null;
  const host = document.createElement("div");
  host.className = "absolute inset-0";
  return host;
}

function moveInto(host: HTMLElement, slot: HTMLElement) {
  if (host.parentElement === slot) return;

  const video = host.querySelector("video");
  const wasPlaying = !!video && !video.paused;
  slot.appendChild(host);
  // Chrome pauses a media element the moment it leaves the document, even
  // when it is put straight back.
  if (wasPlaying) video.play().catch(() => {});
}

const FORMATS = [
  {
    id: "solo",
    title: "Solo",
    subtitle: "One Voice",
    thumbnail: "/image/Solo.webp",
    mainImage: "/image/Solo.webp",
    video: "/video/format/SOLO.mp4",
    details: (
      <>
        <p className="text-red-600 uppercase tracking-widest text-sm font-semibold mb-2">
          Live Elegance
        </p>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          SOLO
        </h3>
        <p className="mb-4 text-gray-300 leading-relaxed text-lg">
          As a solo performer, I provide live entertainment for a wide range of
          events and occasions.
        </p>
        <p className="mb-8 text-gray-300 leading-relaxed text-lg">
          My repertoire includes Jazz, Soul, Pop, Latin, Disco and world-famous
          hits.
          <br />
          Performing live at restaurants, private events, weddings, corporate
          events, and special occasions.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Solo Show
        </h4>
        <p className="mb-6 text-gray-300 leading-relaxed text-lg">
          A complete vocal performance tailored to your event, audience, and
          atmosphere. I create a personalized program and perform with
          high-quality backing tracks.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Guest Vocalist
        </h4>
        <p className="mb-6 text-gray-300 leading-relaxed text-lg">
          Available as a guest vocalist for concert programs, orchestras, and
          live bands, adding a professional vocal performance to larger musical
          projects.
        </p>

        <h4 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
          Studio Work
        </h4>
        <p className="text-gray-300 leading-relaxed text-lg">
          I also work as a studio vocalist for recording projects,
          collaborations, and original music productions.
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
    video: "/video/format/DUO.mp4",
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
    video: "/video/format/TRIO.mp4",
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
    video: "/video/format/FULL BAND.mp4",
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = FORMATS[selectedIndex];

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePopup]);

  /*
    Video. Every format still renders its photo; one <video> is laid over the
    selected format's photo and plays the clips in order — Solo, Duo, Trio,
    Full Band, then round again — for as long as the section is active.

    It is deliberately a single element that gets moved, not one per format.
    Browsers (Safari above all) only let sound start from a tap, and they
    remember that per element: once the viewer has unmuted this one it may
    carry its sound into the next clip, where a freshly mounted element would
    be forced back to silence. So `videoHost`, a plain DOM box outside React's
    tree, is appended into whichever photo's slot is current, and FormatVideo
    is portalled into it, where it never unmounts.
  */
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [videoHost] = useState(createVideoHost);

  // Both layouts are always in the DOM, one of them hidden by CSS, so each has
  // its own slots (`data-video-slot`) and the layout is part of the key.
  const slotKey =
    isDesktop === null
      ? null
      : `${isDesktop ? "side" : "stacked"}:${selected.id}`;

  // No dependency list on purpose. It is one lookup, and re-checking after
  // every render means a panel framer-motion swaps out mid-animation can never
  // leave the video stranded in a slot that is on its way out.
  useLayoutEffect(() => {
    if (!videoHost || !slotKey) return;
    const slot = sectionRef.current?.querySelector<HTMLElement>(
      `[data-video-slot="${slotKey}"]`,
    );
    if (slot) moveInto(videoHost, slot);
  });

  // "Active": on screen, once the loading screen has lifted (the same gate the
  // scroll reveals use), in a visible tab, and not behind the MORE popup.
  const contentRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(contentRef, { rootMargin: ACTIVE_BAND });
  const introDone = useRevealArmed();
  const pageVisible = usePageVisible();
  const active =
    introDone && pageVisible && !!entry?.isIntersecting && !activePopup;

  const [paused, setPaused] = useState(false);

  const stopFollowRef = useRef<(() => void) | null>(null);

  const show = (index: number, follow: boolean) => {
    setSelectedIndex(index);

    // The inline photos only exist in the stacked layout.
    if (!follow || isDesktop !== false) return;
    const row = sectionRef.current?.querySelector<HTMLElement>(
      `[data-format="${FORMATS[index].id}"]`,
    );
    if (!row) return;
    stopFollowRef.current?.();
    stopFollowRef.current = followSelection(row);
  };

  const handleSelect = (index: number) => {
    // Picking a format is also asking to watch it.
    setPaused(false);
    show(index, true);
  };

  const handleEnded = () => {
    // In the stacked layout the open clip sits one row lower each time. Keep
    // it in view for someone who is watching it, but never scroll the page
    // under a reader whose attention is somewhere else.
    const watching = !!videoHost && isMostlyOnScreen(videoHost);
    show((selectedIndex + 1) % FORMATS.length, watching);
  };

  return (
    <section
      ref={sectionRef}
      id="format"
      className="relative w-full z-10 py-24 px-8 max-w-[1440px] mx-auto flex flex-col mb-20"
    >
      {/* Top Label */}
      <Reveal className="mb-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase">
          DESIGNED FOR EVERY VISION
        </p>
      </Reveal>

      {/* Heading */}
      <Reveal className="mb-12 md:mb-24">
        <h2
          className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase"
          style={{ textShadow: "0px 0px 40px rgba(255,255,255,0.4)" }}
        >
          SHOW FORMAT
        </h2>
      </Reveal>

      {/* Content Columns */}
      <div
        ref={contentRef}
        className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center lg:items-stretch w-full"
      >
        {/* Left Column - List.
            overflow-anchor is off so Chrome's scroll anchoring doesn't also
            shift the page while the photos resize — followSelection owns that,
            and this keeps Chrome and Safari behaving the same. */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 [overflow-anchor:none]">
          {FORMATS.map((format, index) => {
            const isSelected = index === selectedIndex;

            return (
              // Wrapped rather than made the Reveal itself: the row has its
              // own `transition-all`, which would fight the reveal's fade.
              <Reveal key={format.id}>
                <div
                  data-format={format.id}
                  onClick={() => !isSelected && handleSelect(index)}
                  className={`transition-all duration-300 border-2 ${
                    isSelected
                      ? "border-red-600 bg-red-600/5 cursor-default"
                      : "border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6 p-3 md:p-4">
                    {/* Thumbnail */}
                    <div
                      className={`relative w-16 h-16 md:w-24 md:h-24 bg-zinc-800 overflow-hidden flex-shrink-0 transition-all duration-300 ${!isSelected ? "grayscale opacity-50" : ""}`}
                    >
                      <Image
                        src={format.thumbnail}
                        alt={format.title}
                        fill
                        sizes="(max-width: 768px) 64px, 96px"
                        className="object-cover"
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

                  {/* Inline photo and video slot — stacked layout only (see PANEL_MS) */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        key="photo"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={PANEL_TRANSITION}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="px-3 pb-3 md:px-4 md:pb-4">
                          <div className="relative w-full aspect-[4/3] max-h-[70svh] overflow-hidden bg-zinc-900">
                            <Image
                              src={format.mainImage}
                              alt={format.title}
                              fill
                              sizes="100vw"
                              className="object-cover object-[center_30%]"
                            />
                            <div
                              data-video-slot={`stacked:${format.id}`}
                              className="absolute inset-0"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Right Column - Image Stack (side-by-side layout only) */}
        <Reveal className="relative hidden lg:block lg:w-[55%] flex-shrink-0 pr-12">
          {FORMATS.map((format, i) => {
            // Queue order: whatever plays next sits directly behind the front.
            const index =
              (i - selectedIndex + FORMATS.length) % FORMATS.length;
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
                    ? "border-l-[4px] border-black grayscale mix-blend-luminosity"
                    : ""
                }`}
                style={{ right: "48px" }} // Make room for the shifted back elements
              >
                <Image
                  src={format.mainImage}
                  alt={format.title}
                  fill
                  sizes="55vw"
                  className="object-cover"
                />
                <div
                  data-video-slot={`side:${format.id}`}
                  className="absolute inset-0"
                />
              </motion.div>
            );
          })}
        </Reveal>
      </div>

      {/* The one video, carried between the slots above. Not rendered until the
          layout is known, so the hidden layout never loads or plays a copy. */}
      {videoHost &&
        isDesktop !== null &&
        createPortal(
          <FormatVideo
            src={selected.video}
            label={selected.title}
            active={active}
            paused={paused}
            onPausedChange={setPaused}
            onEnded={handleEnded}
          />,
          videoHost,
        )}

      {/* Modal Popup */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activePopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl overscroll-none"
                onClick={() => setActivePopup(null)}
              >
                <motion.div
                  initial={{ y: 50, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto overscroll-contain max-h-[90vh]"
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
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
