"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a CSS media query currently matches.
 *
 * Returns `null` on the server and for the hydrating render, where there is no
 * viewport to ask — so anything that depends on the answer should render
 * nothing layout-specific until it is known, rather than guess and mismatch.
 */
export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
