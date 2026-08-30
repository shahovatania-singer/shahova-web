"use client";

import { useSyncExternalStore } from "react";

/**
 * Scroll reveals stay disarmed until the intro has finished playing.
 *
 * Two things would otherwise spend a reveal where nobody can see it. The
 * loading screen covers the page but does not lock scrolling, so anything the
 * reader scrolls past during the intro would animate behind an opaque overlay.
 * And on reload the browser restores the previous scroll position, so whichever
 * section the reader was parked at is already on screen at mount — its reveal
 * would fire before they touch anything. Since a reveal only plays once per
 * page load, either case burns it for good.
 *
 * Holding every reveal until the curtain is up fixes both: nothing plays
 * unseen, and whatever is on screen when the page opens animates in properly.
 *
 * Derived from the sequence in components/Loading.tsx — three words at 1200ms
 * (3600ms), a 1000ms hold, then a 800ms slide up. Keep this in step if that
 * timing changes; overshooting only delays the first reveal, which is
 * invisible on a normal load because the hero fills the viewport.
 */
const INTRO_MS = 5400;

// One flag and one timer shared by every Reveal on the page. Module scope, so a
// Reveal mounting after the intro reads the armed state straight away instead
// of starting a second countdown of its own.
let armed = false;
let timer: number | null = null;
const subscribers = new Set<() => void>();

function arm() {
  if (armed) return;
  armed = true;
  timer = null;
  subscribers.forEach((notify) => notify());
}

function startTimer() {
  if (armed || timer !== null || typeof window === "undefined") return;
  // performance.now() runs from the start of the document, so a late mount
  // still arms on schedule rather than restarting the countdown.
  timer = window.setTimeout(arm, Math.max(0, INTRO_MS - performance.now()));
}

function subscribe(onStoreChange: () => void) {
  subscribers.add(onStoreChange);
  startTimer();
  return () => {
    subscribers.delete(onStoreChange);
  };
}

const getSnapshot = () => armed;

/**
 * The server has no intro to sit through and renders every reveal hidden, so it
 * always reports disarmed — reporting anything else would hand the client a
 * different tree to hydrate.
 */
const getServerSnapshot = () => false;

export function useRevealArmed() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
