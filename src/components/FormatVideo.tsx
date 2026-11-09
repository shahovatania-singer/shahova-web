"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { cn } from "@/lib/utils";

/** How long tapped-open controls stay up on a touch screen. */
const CONTROLS_MS = 3000;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface FormatVideoProps {
  src: string;
  /** Names the clip in the controls' labels, e.g. "Solo". */
  label: string;
  /** The section is on screen with nothing covering it. */
  active: boolean;
  /**
   * The viewer's own pause. Kept apart from `active`, which comes and goes
   * with scrolling, so a clip they paused is still paused when they return.
   */
  paused: boolean;
  onPausedChange: (paused: boolean) => void;
  /** The clip played through to its end. */
  onEnded: () => void;
}

/**
 * The Format section's video: muted and chromeless until the viewer hovers or
 * taps it. Format.tsx keeps a single instance alive and only changes `src`, so
 * this is one <video> element for the whole sequence — see the note there on
 * why that matters for sound.
 *
 * It fills its parent and starts transparent, so whatever sits underneath (the
 * format's photo) works as the poster until the first frame has arrived.
 */
export default function FormatVideo({
  src,
  label,
  active,
  paused,
  onPausedChange,
  onEnded,
}: FormatVideoProps) {
  const { pauseMusic } = useAudioPlayer();
  const videoRef = useRef<HTMLVideoElement>(null);

  // These mirror the element rather than drive it. The element is what the
  // browser, the music player and the viewer all act on, so its events are the
  // one place every change shows up.
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);

  // The clip whose first frame has arrived; until it matches `src` the photo
  // underneath stays in view.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  const wantsPlay = active && !paused;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!wantsPlay) {
      video.pause();
      return;
    }

    let stale = false;
    video.play().catch((error: DOMException) => {
      // An AbortError only means a newer clip or a pause overtook this call.
      if (stale || error.name !== "NotAllowedError") return;

      if (!video.muted) {
        // The browser won't start sound unprompted — carry on without it.
        video.muted = true;
        video.play().catch(() => {
          if (!stale) onPausedChange(true);
        });
      } else {
        // Not even silent autoplay is allowed (iOS Low Power Mode, a strict
        // browser setting). Show the play button and leave it to the viewer.
        onPausedChange(true);
      }
    });

    return () => {
      stale = true;
    };
    // `src` is listed so a new clip starts as soon as the element points at it.
  }, [wantsPlay, src, onPausedChange]);

  // One sound at a time. When anything else on the page starts playing with
  // sound — the music player's <audio>, a clip in the video modal — this goes
  // quiet. `play` doesn't bubble, hence listening in the capture phase.
  useEffect(() => {
    const quieten = (event: Event) => {
      const video = videoRef.current;
      const other = event.target;
      if (!video || other === video) return;
      if (other instanceof HTMLMediaElement && !other.muted) video.muted = true;
    };

    document.addEventListener("play", quieten, true);
    return () => document.removeEventListener("play", quieten, true);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (paused) {
      // Started from inside the click, so a browser that refused to autoplay
      // accepts it.
      video.play().catch(() => {});
      onPausedChange(false);
    } else {
      video.pause();
      onPausedChange(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    // Written to the element here, not routed through state. Safari only lets
    // sound begin from inside the gesture, and unmuting this way is also what
    // clears this element to keep its sound for the clips that follow.
    video.muted = !video.muted;
    if (!video.muted) pauseMusic();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const next = parseFloat(e.target.value);
    video.currentTime = next;
    setTime(next);
  };

  const handlePause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // We pause the element ourselves whenever `wantsPlay` drops, it pauses on
    // its own at the end of a clip, and browsers pause it in a hidden tab.
    // Anything else — a media key, a headset, a phone call — is the viewer's
    // pause, and the controls should say so instead of showing it as playing.
    const video = e.currentTarget;
    const expected =
      !wantsPlay || video.ended || document.visibilityState !== "visible";
    if (video.paused && !expected) onPausedChange(true);
  };

  /*
    Controls. With a mouse they are pure CSS: shown while the pointer is over
    the video (Tailwind only applies `hover:` on devices that can hover) or
    while one of them has keyboard focus. A touch screen has neither, so there a
    tap brings them up for a few seconds, and the sound button stays visible
    throughout — otherwise nothing would hint that the clips have sound.
  */
  const [tapped, setTapped] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const pointerType = useRef("mouse");

  const cancelHide = () => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  };

  const showControls = () => {
    cancelHide();
    setTapped(true);
    hideTimer.current = window.setTimeout(() => setTapped(false), CONTROLS_MS);
  };

  useEffect(() => cancelHide, []);

  const handleSurfaceClick = () => {
    if (pointerType.current !== "touch") {
      togglePlay();
    } else if (tapped) {
      cancelHide();
      setTapped(false);
    } else {
      showControls();
    }
  };

  const controlsUp = tapped || paused;
  const reveal = controlsUp
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100";
  // Hidden controls must not swallow a tap meant for the video itself.
  const hit = controlsUp
    ? "pointer-events-auto"
    : "pointer-events-none group-hover:pointer-events-auto group-has-[:focus-visible]:pointer-events-auto";

  const percent = duration > 0 ? Math.min((time / duration) * 100, 100) : 0;
  const busy = wantsPlay && (!loaded || buffering);

  return (
    <div
      className="group absolute inset-0 overflow-hidden"
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
        // Using the controls keeps them up.
        if (e.pointerType === "touch" && tapped) showControls();
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        preload="none"
        aria-label={`${label} performance`}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-0",
          loaded && "opacity-100 transition-opacity duration-500",
        )}
        onLoadedData={() => setLoadedSrc(src)}
        onEmptied={() => {
          setTime(0);
          setDuration(0);
          setBuffering(false);
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onPause={handlePause}
        onEnded={onEnded}
      />

      {/* Spinner — delayed, so a clip that starts promptly never shows it */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300",
          busy && "opacity-100 delay-700",
        )}
      >
        <div
          className={cn(
            "h-10 w-10 rounded-full border-4 border-white/20 border-t-red-600",
            busy && "animate-spin",
          )}
        />
      </div>

      {/* Click surface: play/pause with a mouse, show/hide controls by touch */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleSurfaceClick}
      />

      {paused && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`Play ${label} video`}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_40px_rgba(220,38,38,0.6)] backdrop-blur-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <PlayIcon size={28} className="ml-1" />
        </button>
      )}

      {/* Progress along the bottom edge while the controls are away */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-white/15 transition-opacity duration-300",
          controlsUp
            ? "opacity-0"
            : "opacity-100 group-hover:opacity-0 group-has-[:focus-visible]:opacity-0",
        )}
      >
        <div className="h-full bg-red-600" style={{ width: `${percent}%` }} />
      </div>

      {/* Control bar. The bar itself lets clicks through to the surface. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300",
          reveal,
        )}
      >
        <div className={cn("relative h-1 w-full rounded-full bg-white/25", hit)}>
          {/* Listed first so the thumb below can react to its focus. */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="any"
            value={time}
            onChange={handleSeek}
            aria-label={`Seek ${label} video`}
            className="peer absolute -top-2 left-0 m-0 h-5 w-full cursor-pointer opacity-0"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-red-600"
            style={{ width: `${percent}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100"
            style={{ left: `${percent}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? `Play ${label} video` : `Pause ${label} video`}
            className={cn(
              "flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:text-red-500 focus-visible:outline-2 focus-visible:outline-white",
              hit,
            )}
          >
            {paused ? <PlayIcon size={22} /> : <PauseIcon size={22} />}
          </button>
          <span className="font-mono text-xs font-medium tracking-widest text-gray-300">
            {formatTime(time)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Sound. Apart from the bar so it can stay up on its own on touch
          screens, and in the top corner because the sticky music player sits
          over the bottom of the viewport — exactly when this button is the way
          to choose between the two. */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className={cn(
          "absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-[opacity,color] duration-300 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-white",
          reveal,
          hit,
          "[@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100",
        )}
      >
        {muted ? <SoundOffIcon size={20} /> : <SoundOnIcon size={20} />}
      </button>
    </div>
  );
}

interface IconProps {
  size: number;
  className?: string;
}

function PlayIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    </svg>
  );
}

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SoundOnIcon({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} aria-hidden {...strokeProps}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function SoundOffIcon({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} aria-hidden {...strokeProps}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
