"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRevealArmed } from "@/hooks/useRevealArmed";

/**
 * Scroll reveal, modelled on Webflow's `slideInBottom` preset as used on
 * dg-cinema.com: the element rises 100px into place while fading in, over
 * one second on an outQuart curve.
 */

// outQuart — the curve Webflow applies to the preset.
const OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

// How far the element travels before settling.
const DISTANCE = 100;

const DURATION = 1;

/**
 * Trip the reveal once the element has cleared 30% of the viewport height from
 * the bottom edge — Webflow's `scrollOffsetValue: 30%`.
 */
const ROOT_MARGIN = "0px 0px -30% 0px";

const VARIANTS = {
  hidden: { opacity: 0, y: DISTANCE },
  shown: { opacity: 1, y: 0 },
};

interface RevealProps {
  children: React.ReactNode;
  /** Passed straight through, so a Reveal can replace an existing wrapper div. */
  className?: string;
  /**
   * Seconds to hold before rising. Each Reveal watches itself, so elements
   * stacked vertically already cascade; a small delay makes the order
   * deterministic when several cross the trigger line in the same frame.
   */
  delay?: number;
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  // Held back until the intro is over, so a reveal is never spent behind the
  // loading screen or on a restored scroll position the reader never chose.
  const armed = useRevealArmed();

  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  /**
   * Should anything be running without IntersectionObserver, show the content
   * rather than hide it. Derived here rather than set from the effect so the
   * server — where `armed` is always false — still renders the hidden state.
   */
  const canObserve =
    typeof IntersectionObserver !== "undefined" || typeof window === "undefined";
  const shown = revealed || (armed && !canObserve);

  /**
   * The observer is ours rather than framer-motion's `whileInView`. Gating that
   * prop kept revealing the element early regardless of the gate, and a reveal
   * that fires when it should not is the whole bug being avoided here. Owning
   * the observer makes the rule exact: nothing is watched before the reveal is
   * armed, and `shown` latches, so each element rises once per page load and
   * scrolling back over it does nothing.
   */
  useEffect(() => {
    if (!armed || shown) return;

    const node = ref.current;
    if (!node || !canObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed, shown, canObserve]);

  return (
    // `data-reveal` is the hook globals.css uses to pin this element to its
    // settled state under `prefers-reduced-motion`. Handling that in CSS rather
    // than by branching on framer-motion's `useReducedMotion()` is deliberate:
    // that hook always reads `false` during SSR, so branching would render a
    // different tree on the server than on the client. CSS applies before any
    // JS runs and needs no hydration to be correct.
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      variants={VARIANTS}
      initial="hidden"
      animate={shown ? "shown" : "hidden"}
      transition={{ duration: DURATION, ease: OUT_QUART, delay }}
    >
      {children}
    </motion.div>
  );
}
