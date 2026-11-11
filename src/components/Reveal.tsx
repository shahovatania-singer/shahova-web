"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRevealArmed } from "@/hooks/useRevealArmed";

/**
 * Scroll reveal: a block stays invisible until it scrolls into view, then rises
 * into place while fading in — once per page load.
 *
 * This file decides *when*. *How it looks* (distance, duration, easing) is the
 * `[data-reveal]` CSS in globals.css. The motion is a CSS animation rather than
 * a JS-driven one so it runs on the compositor: the page also runs the star
 * canvas, the hero marquee and video on the main thread, and an animation
 * sharing that thread drops frames exactly when a lot is revealing at once.
 */

/**
 * A block reveals once its top edge is this far above the bottom of the
 * viewport. Enough that the motion plays where the reader is looking, not so
 * much that a block sits on screen invisible.
 */
const TRIGGER_MARGIN = "0px 0px -10% 0px";

/**
 * Blocks that cross the line in the same frame — a row of gallery tiles, or a
 * whole screenful after a reload — follow each other in reading order instead
 * of moving as one slab. The cap keeps the last of a large batch from waiting.
 */
const STAGGER_MS = 70;
const MAX_STAGGER_MS = 420;

type OnReveal = (delayMs: number) => void;

// One observer for every Reveal on the page. Besides being cheaper than one
// each, it is what makes the stagger possible: a shared observer reports all
// the blocks that crossed in a frame in a single callback.
const waiting = new Map<Element, OnReveal>();
let observer: IntersectionObserver | null = null;

function inReadingOrder(
  a: IntersectionObserverEntry,
  b: IntersectionObserverEntry,
) {
  const rowA = Math.round(a.boundingClientRect.top);
  const rowB = Math.round(b.boundingClientRect.top);
  return rowA - rowB || a.boundingClientRect.left - b.boundingClientRect.left;
}

function handleEntries(entries: IntersectionObserverEntry[]) {
  entries
    .filter((entry) => entry.isIntersecting)
    .sort(inReadingOrder)
    .forEach(({ target }, i) => {
      const onReveal = waiting.get(target);
      unwatch(target);
      onReveal?.(Math.min(i * STAGGER_MS, MAX_STAGGER_MS));
    });
}

function watch(node: Element, onReveal: OnReveal) {
  observer ??= new IntersectionObserver(handleEntries, {
    rootMargin: TRIGGER_MARGIN,
  });
  waiting.set(node, onReveal);
  observer.observe(node);
}

function unwatch(node: Element) {
  waiting.delete(node);
  observer?.unobserve(node);
}

/**
 * Renders a `div` and passes every prop through, so a Reveal can stand in for
 * an existing wrapper — classes, click handlers and all — instead of adding a
 * layer around it.
 *
 * Don't put it on an element that carries its own `transition-all`, opacity or
 * transform; wrap that element instead.
 */
export default function Reveal({
  children,
  style,
  ...rest
}: React.ComponentPropsWithoutRef<"div">) {
  // Held back until the intro is over, so a reveal is never spent behind the
  // loading screen or on a restored scroll position the reader never chose.
  const armed = useRevealArmed();

  const ref = useRef<HTMLDivElement>(null);
  // null until the block is revealed, then the stagger delay it was given.
  const [delayMs, setDelayMs] = useState<number | null>(null);

  /**
   * Should anything be running without IntersectionObserver, show the content
   * rather than hide it. Derived here rather than set from the effect so the
   * server — where `armed` is always false — still renders the hidden state.
   */
  const canObserve =
    typeof IntersectionObserver !== "undefined" || typeof window === "undefined";
  const revealed = delayMs !== null || (armed && !canObserve);

  /**
   * The observer is ours rather than framer-motion's `whileInView`. Gating that
   * prop kept revealing the element early regardless of the gate. Here nothing
   * is watched before the reveal is armed, and a revealed block is never
   * watched again, so each one plays once per page load and scrolling back
   * over it does nothing.
   *
   * A waiting block has no transform (it is only transparent), so the observer
   * measures it where it will actually sit, not where the animation starts.
   */
  useEffect(() => {
    if (!armed || revealed) return;

    const node = ref.current;
    if (!node) return;

    watch(node, setDelayMs);
    return () => unwatch(node);
  }, [armed, revealed]);

  return (
    <div
      {...rest}
      ref={ref}
      // globals.css keys the hidden state and the animation off this. It also
      // pins the settled state under `prefers-reduced-motion` there, in CSS
      // rather than by branching in JS, so server and client render the same
      // tree.
      data-reveal={revealed ? "in" : "pending"}
      style={
        delayMs
          ? ({ ...style, "--reveal-delay": `${delayMs}ms` } as React.CSSProperties)
          : style
      }
    >
      {children}
    </div>
  );
}
