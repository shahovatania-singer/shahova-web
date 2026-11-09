"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const getSnapshot = () => document.visibilityState === "visible";

// Nobody is looking at a server render, but reporting "hidden" there would only
// make the first client render disagree with it.
const getServerSnapshot = () => true;

/** False while the tab is in the background or the window is minimised. */
export function usePageVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
