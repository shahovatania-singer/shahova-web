# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test framework in this project — verify changes by running the dev server and looking at the page.

`npm run lint` is **not clean on `main`**: it reports about 10 errors, mostly `react-hooks/set-state-in-effect` and `react-hooks/refs` from the React-Compiler-era rules in eslint-config-next 16. Six of them come from the `useEffect(() => setMounted(true))` portal guard described under Conventions. Judge a change by whether it adds new problems, not by the exit code. For new client-only state, the `useSyncExternalStore` approach in `useRevealArmed.ts` passes these rules.

## What this is

A single-page marketing/portfolio site for the musician SHAHOVA. Next.js 16 App Router, React 19, Tailwind v4, framer-motion. Everything is static: no API routes, no database, no env vars, no data fetching. All content is hardcoded in component-local arrays and `src/constants/`; all media lives in `public/`.

## Architecture

**One page, stacked sections.** [src/app/page.tsx](src/app/page.tsx) composes every section in order (Loading → Header → Hero → About → Format → Music → Live → Experience → Gallery → Contact → Footer → StickyPlayer). Adding a section means adding a component here plus an entry in the nav array in [Header.tsx:34-41](src/components/Header.tsx#L34-L41) — the header scrolls by `document.getElementById(id)`, so the section's `id` must match.

**Audio is global, not per-section.** [AudioPlayerContext](src/context/AudioPlayerContext.tsx) is mounted in [layout.tsx](src/app/layout.tsx) and owns the single `<audio>` element for the whole app, plus playback state (`activeIndex`, `isPlaying`, `progress`, `duration`). Two UIs consume it:

- [Music.tsx](src/components/Music.tsx) — the full 3D carousel player. It reports its own viewport visibility into the context via `useIntersectionObserver` → `setIsMainPlayerVisible`.
- [StickyPlayer.tsx](src/components/StickyPlayer.tsx) — the mini player, rendered only when `!isMainPlayerVisible && hasActivePlayback`.

`hasActivePlayback` is distinct from `isPlaying`: it tracks whether the sticky player should exist at all, and is cleared by `closeStickyPlayer`. When adding a track, edit [src/constants/songs.ts](src/constants/songs.ts) — image and `src` paths must match files in `public/image/` and `public/sound/` exactly, including case (the audio files mix `.MP3` and `.mp3`).

**Video is separate from audio.** Clips open in [VideoModal](src/components/VideoModal.tsx) (portal into `document.body`, z-index 9999) wrapping [CustomVideoPlayer](src/components/CustomVideoPlayer.tsx). The modal pauses the audio context on open so the two never play at once. Clip lists are local arrays inside `Carousel.tsx` and `Live.tsx`, not in `constants/`.

**Two different carousels — don't confuse them.**

- [Carousel.tsx](src/components/Carousel.tsx) (Hero): a hand-rolled infinite marquee. Four copies of the item set are rendered; a `requestAnimationFrame` loop mutates `trackRef.current.style.transform` directly and wraps `offsetRef` between `setWidth` and `setWidth * 2`. All animation state lives in refs — deliberately, so the loop never triggers a React render. Pointer drag sets `hasDraggedRef` to suppress the click that would otherwise open a video. The curved top/bottom edges come from a `clipPath: path(...)` string recomputed by a `ResizeObserver`; the ellipse math (`sqrt(5)/3`) is what keeps the arc from clipping the cards.
- [Music.tsx](src/components/Music.tsx): a framer-motion 3D coverflow driven by `activeIndex` from the audio context — a normal React render, no refs.

**`swiper` is a leftover dependency.** Nothing imports it; only two orphan `.swiper-slide` rules remain in [globals.css](src/app/globals.css#L45-L51). Don't reach for it when building a new carousel.

**Stars background.** [StarsBackground.tsx](src/components/StarsBackground.tsx) wraps the entire page and paints 1200 stars onto a fixed full-viewport `<canvas>` in its own rAF loop with mouse parallax. It is deliberately canvas-based (a previous framer-motion version had memory-use problems, see `c95cfa0`). It is also mounted a *second* time inside [Loading.tsx](src/components/Loading.tsx) with `className="bg-transparent min-h-0"` — changing its root classes affects both.

**Loading screen** is a self-contained overlay at `z-[99999]` that runs a fixed ~4.6s word sequence, then slides up behind an animated SVG curve. It renders a solid black div while `dimension.width === 0` (SSR/pre-hydration) to prevent the page flashing through — regressions here have been fixed twice (`df86f38`, `1875c09`). Its timing is mirrored by hand in `INTRO_MS` (see below); change both together.

**Scroll reveals.** Section headings (every section except Hero) are wrapped in [Reveal.tsx](src/components/Reveal.tsx), usually as a heading `<Reveal>` plus a subheading `<Reveal delay={0.08}>`. Each one rises 100px and fades in once per page load. The parts that aren't obvious:

- Reveals stay disarmed until the loading screen is gone, via [useRevealArmed.ts](src/hooks/useRevealArmed.ts): a module-level `useSyncExternalStore` flag with a single shared timer that arms at `INTRO_MS = 5400`, measured from `performance.now()`. That number is hard-coded from Loading.tsx's sequence (3 words × 1200ms + 1000ms hold + 800ms slide). Without the gate, reveals fire behind the overlay, or straight away on a reload that restores the scroll position.
- Reveal runs its own `IntersectionObserver` instead of framer-motion's `whileInView`, which kept firing early despite the gate. Don't switch it back.
- Reduced motion is handled in CSS (the `[data-reveal]` rule in [globals.css](src/app/globals.css#L38-L43)), not with `useReducedMotion()`. That hook reads `false` during SSR and would cause a hydration mismatch.

## Conventions

- `"use client"` on anything with hooks, animation, or events. `Hero`, `Experience`, `Contact` and `Footer` are server components and should stay that way. They can still render client children such as `Reveal` or `Carousel` without becoming client components themselves.
- Modals/lightboxes use `createPortal(..., document.body)` behind a `mounted` state guard, set `document.body.style.overflow = "hidden"`, and close on `Escape`. Follow the existing pattern in `Gallery.tsx` / `About.tsx` / `Format.tsx` / `VideoModal.tsx` rather than inventing a new one.
- **Z-index is a global ordering, not per-component.** Roughly: canvas `z-0` → sections `z-10` → footer `z-20` (layers inside a section go up to `z-40`) → header, noise overlay and sticky player all at `z-50` → About/Format/Gallery modals `z-[60]` → video modal `z-[9999]` → loading `z-[99999]`. Check this list before picking a new value.
- Styling is Tailwind v4 utilities only (`@import "tailwindcss"` in globals.css, no `tailwind.config`). Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) when merging conditional classes. The visual language is fixed: black background, red-600 accent, `font-black uppercase tracking-tighter` headings sized in `vw`.
- Images go through `next/image` with explicit `sizes`; plain `<img>` (as `motion.img`, behind an eslint-disable comment) is used only in the Gallery and About lightboxes, where images have arbitrary aspect ratios. The one other exception is the Header logo (`/assets/logo.svg`).
- Filenames in `public/` contain spaces, commas, and Cyrillic (`Весняним дощем clip.webp`). Reference them verbatim — they are not slugified.

## Loose ends

`src/app/test.tsx` and `test-aspect.html` are scratch files from working out video modal sizing. They are not routed or imported and can be ignored.
