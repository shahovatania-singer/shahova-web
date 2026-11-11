# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit  # type check only; clean on main
```

There is no test framework in this project — verify changes by running the dev server and looking at the page.

`npm run lint` is **not clean on `main`**: it reports 10 errors (plus about a dozen warnings, mostly unused variables), nearly all from the React-Compiler-era rules in eslint-config-next 16. Six are setState-on-mount calls (`react-hooks/set-state-in-effect`): the `useEffect(() => setMounted(true))` portal guard described under Conventions (About, Format, Gallery, VideoModal), CustomVideoPlayer's identical `setHasMounted`, and Loading's initial `setDimension`. The other four: `setHasActivePlayback` inside an effect in AudioPlayerContext, two `react-hooks/refs` hits on the `elementRef.current` dependency in `useIntersectionObserver.ts`, and one `no-explicit-any` in Carousel. Judge a change by whether it adds new problems, not by the exit code. For new client-only state, the `useSyncExternalStore` approach in `useRevealArmed.ts` passes these rules.

**The dev server can serve a stale `globals.css`.** Seen on 2026-11-11 with Next 16.2.9 (Turbopack): edits to [globals.css](src/app/globals.css) were not picked up while `npm run dev` was running, and the old stylesheet was still served after a restart, until `.next/dev/cache/turbopack` was deleted. Edits to `.tsx` files reloaded normally and `npm run build` was not affected. If a CSS change doesn't show up, stop the dev server, delete that folder and start it again.

## What this is

A single-page marketing/portfolio site for the musician SHAHOVA. Next.js 16 App Router, React 19, Tailwind v4, framer-motion. Everything is static: no API routes, no database, no env vars, no data fetching. All content is hardcoded in component-local arrays and `src/constants/`; all media lives in `public/` and is committed to git. That folder is about 620 MB, nearly all of it `public/video/`, where the modal clips run up to 90 MB each.

## Architecture

**One page, stacked sections.** [src/app/page.tsx](src/app/page.tsx) composes every section in order (Loading → Header → Hero → About → Format → Music → Live → Experience → Gallery → Contact → Footer → StickyPlayer). Adding a section means adding a component here plus an entry in the nav array in [Header.tsx:34-41](src/components/Header.tsx#L34-L41) — the header scrolls by `document.getElementById(id)`, so the section's `id` must match. It scrolls to the section's top edge with `window.scrollTo`, which ignores the `scroll-margin-top` rule in globals.css, so each section clears the fixed 64px header with its own top padding (`py-24`).

**Audio is global, not per-section.** [AudioPlayerContext](src/context/AudioPlayerContext.tsx) is mounted in [layout.tsx](src/app/layout.tsx) and owns the single `<audio>` element for the whole app, plus playback state (`activeIndex`, `isPlaying`, `progress`, `duration`). Two UIs consume it:

- [Music.tsx](src/components/Music.tsx) — the full 3D carousel player. It reports its own viewport visibility into the context via `useIntersectionObserver` → `setIsMainPlayerVisible`.
- [StickyPlayer.tsx](src/components/StickyPlayer.tsx) — the mini player, rendered only when `!isMainPlayerVisible && hasActivePlayback`.

`hasActivePlayback` is distinct from `isPlaying`: it tracks whether the sticky player should exist at all, and is cleared by `closeStickyPlayer`. When adding a track, edit [src/constants/songs.ts](src/constants/songs.ts) — image and `src` paths must match files in `public/image/` and `public/sound/` exactly, including case (the audio files mix `.MP3` and `.mp3`).

**Video is separate from audio.** Clips open in [VideoModal](src/components/VideoModal.tsx) (portal into `document.body`, z-index 9999) wrapping [CustomVideoPlayer](src/components/CustomVideoPlayer.tsx). The modal pauses the audio context on open so the two never play at once. Clip lists are local arrays inside `Carousel.tsx` and `Live.tsx`, not in `constants/`.

**Two different carousels — don't confuse them.**

- [Carousel.tsx](src/components/Carousel.tsx) (Hero): a hand-rolled infinite marquee. Four copies of the item set are rendered; a `requestAnimationFrame` loop mutates `trackRef.current.style.transform` directly and wraps `offsetRef` between `setWidth` and `setWidth * 2`. All animation state lives in refs — deliberately, so the loop never triggers a React render. Pointer drag sets `hasDraggedRef` to suppress the click that would otherwise open a video. The curved top/bottom edges come from a `clipPath: path(...)` string recomputed by a `ResizeObserver`; the ellipse math (`sqrt(5)/3`) is what keeps the arc from clipping the cards.
- [Music.tsx](src/components/Music.tsx): a framer-motion 3D coverflow driven by `activeIndex` from the audio context — a normal React render, no refs.

**Format has two layouts.** On `lg` and up, [Format.tsx](src/components/Format.tsx) shows the list beside a stack of photos (the selected one on top). Below `lg` the stack is hidden and each row opens its own photo beneath it, like an accordion. Picking a row collapses the photo above it, which would drag the new row under the header. `followSelection()` corrects for that by nudging the scroll on every framer-motion `postRender` until the layout settles. Because of that, the list has `[overflow-anchor:none]`, and the code calls `scrollBy` with `behavior: "instant"`: `<html>` has `scroll-behavior: smooth`, and a smooth scroll would lag behind the resize. The JS checks the breakpoint through `DESKTOP_QUERY`, which must match Tailwind's `lg`.

**Format plays video over those photos.** One `<video>` ([FormatVideo.tsx](src/components/FormatVideo.tsx)) sits on top of the selected format's photo and plays the four clips in order, looping, for as long as the section is "active": overlapping the middle of the viewport, after the loading screen (`useRevealArmed`), in a visible tab, with the MORE popup closed. It starts muted; controls show on hover (desktop) or tap (touch). The parts that aren't obvious:

- It is a single element that is physically moved, not one per format. Format.tsx owns a detached `videoHost` div, appends it into the current `data-video-slot` element in a layout effect, and portals FormatVideo into it so it never unmounts. Safari only allows sound on an element the viewer unmuted by hand, so a fresh element per clip would go silent at every clip change. Don't `key` it by format or render a second one.
- Both layouts are always in the DOM (CSS hides one), each with its own slots. The video isn't rendered until `useMediaQuery` knows which layout is showing, otherwise the hidden one would download and play a copy.
- One sound at a time, across three sources. Unmuting the clip calls `pauseMusic()`; a capture-phase `play` listener mutes the clip again when the music player or the video modal starts.
- When a clip ends in the stacked layout, the next row is scrolled into view with `followSelection()` only if the viewer was watching (the video was at least half on screen). Otherwise the page is left alone.
- The stack behind the front card is in play order (next clip directly behind), derived from `selectedIndex`.
- Clips live in `public/video/format/` and are re-encoded for inline autoplay (720×1280, about 2 Mbps, `moov` atom first). Camera originals run about 13 Mbps and should not be referenced directly. To add or replace one: `ffmpeg -i in.mp4 -vf scale=720:-2 -r 30 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -map_metadata -1 -movflags +faststart out.mp4`. The photos stay as each clip's poster and as the cards behind the front one.

**`swiper` is a leftover dependency.** Nothing imports it; only two orphan `.swiper-slide` rules remain in [globals.css](src/app/globals.css#L94-L100). Don't reach for it when building a new carousel.

**Stars background.** [StarsBackground.tsx](src/components/StarsBackground.tsx) wraps the entire page and paints 1200 stars onto a fixed full-viewport `<canvas>` in its own rAF loop with mouse parallax. It is deliberately canvas-based (a previous framer-motion version had memory-use problems, see `c95cfa0`). It is also mounted a *second* time inside [Loading.tsx](src/components/Loading.tsx) with `className="bg-transparent min-h-0"` — changing its root classes affects both.

**Loading screen** is a self-contained overlay at `z-[99999]` that runs a fixed ~4.6s word sequence, then slides up behind an animated SVG curve. It renders a solid black div while `dimension.width === 0` (SSR/pre-hydration) to prevent the page flashing through — regressions here have been fixed twice (`df86f38`, `1875c09`). Its timing is mirrored by hand in `INTRO_MS` (see below); change both together. Its portrait (`/image/artist.webp`) is preloaded by a `<link rel="preload">` in [layout.tsx](src/app/layout.tsx); if the image changes, change that link too.

**Scroll reveals.** Everything in About, Format, Music, Live, Experience, Gallery and Contact (label, heading and each block of content) is wrapped in [Reveal.tsx](src/components/Reveal.tsx): invisible until it scrolls into view, then it rises 64px and fades in, once per page load. Hero, Header and Footer are not revealed. The parts that aren't obvious:

- There is one Reveal per block a reader takes in at once (a paragraph, a grid tile, a list row, the Music coverflow), not one per section. Content added to these sections needs its own Reveal, or it will sit there fully visible while its neighbours animate in.
- Reveal renders a `div` and passes every prop through, so it normally replaces an existing wrapper (`<Reveal className=… onClick=…>`) rather than adding a layer. Wrap instead when the element has its own `transition-all`, opacity or transform, as Format's rows do.
- When a block reveals is decided in Reveal.tsx: one shared `IntersectionObserver` fires once the block's top edge is 10% of the viewport height above the bottom of the screen, and blocks that cross in the same frame are staggered 70ms apart in reading order. How it looks is the `[data-reveal]` CSS in [globals.css](src/app/globals.css#L32-L92) (`--reveal-rise`, durations, easing).
- The motion is a CSS animation on purpose, so it runs on the compositor. The star canvas, the hero marquee and video already keep the main thread busy, and a JS-driven animation (framer-motion's `y`) dropped frames when many blocks revealed at once. Don't move it back.
- A waiting block is transparent but not shifted, so it holds its place in the layout and the observer measures where it will really sit. The animation fills `backwards` only: once it ends the block is back on its plain styles, with no leftover stacking context or containing block.
- Reveals stay disarmed until the loading screen is gone, via [useRevealArmed.ts](src/hooks/useRevealArmed.ts): a module-level `useSyncExternalStore` flag with a single shared timer that arms at `INTRO_MS = 5400`, measured from `performance.now()`. That number is hard-coded from Loading.tsx's sequence (3 words × 1200ms + 1000ms hold + 800ms slide). Without the gate, reveals fire behind the overlay, or straight away on a reload that restores the scroll position.
- Reveal runs its own `IntersectionObserver` instead of framer-motion's `whileInView`, which kept firing early despite the gate. Don't switch it back.
- Reduced motion is handled in the same CSS, not with `useReducedMotion()`. That hook reads `false` during SSR and would cause a hydration mismatch.

## Conventions

- `"use client"` on anything with hooks, animation, or events. `Hero`, `Experience`, `Contact` and `Footer` are server components and should stay that way. They can still render client children such as `Reveal` or `Carousel` without becoming client components themselves.
- Modals/lightboxes use `createPortal(..., document.body)` behind a `mounted` state guard, set `document.body.style.overflow = "hidden"`, and close on `Escape`. Follow the existing pattern in `Gallery.tsx` / `About.tsx` / `Format.tsx` / `VideoModal.tsx` rather than inventing a new one.
- **Z-index is a global ordering, not per-component.** Roughly: canvas `z-0` → sections `z-10` → footer `z-20` (layers inside a section go up to `z-40`) → header, noise overlay and sticky player all at `z-50` → About/Format/Gallery modals `z-[60]` → video modal `z-[9999]` → loading `z-[99999]`. Check this list before picking a new value.
- Styling is Tailwind v4 utilities only (`@import "tailwindcss"` in globals.css, no `tailwind.config`). Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) when merging conditional classes. The visual language is fixed: black background, red-600 accent, `font-black uppercase tracking-tighter` headings sized in `vw`.
- Images go through `next/image` with explicit `sizes`; plain `<img>` (as `motion.img`, behind an eslint-disable comment) is used only in the Gallery and About lightboxes, where images have arbitrary aspect ratios. The one other exception is the Header logo (`/assets/logo.svg`).
- Filenames in `public/` contain spaces, commas, and Cyrillic (`Весняним дощем clip.webp`). Reference them verbatim — they are not slugified.

## Loose ends

`src/app/test.tsx` and `test-aspect.html` are scratch files from working out video modal sizing. They are not routed or imported and can be ignored.

`README.md` is the untouched create-next-app template and says nothing about this project. Its note about the Geist font is misleading: layout.tsx loads Geist as CSS variables, but `body` in globals.css is set to Arial.
