"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import VideoModal from "./VideoModal";

const items = [
  {
    id: 1,
    title: "Summer in Hawaii",
    image: "/image/Summer in Hawaii clip.webp",
    video: "/video/Summer in Hawaii clip.mp4",
  },
  {
    id: 2,
    title: "Весняним дощем",
    image: "/image/Весняним дощем clip.webp",
    video: "/video/Весняним дощем clip.mp4",
  },
  {
    id: 3,
    title: "Haifa, Haifa",
    image: "/image/Haifa, Haifa clip.webp",
    video: "/video/Haifa, Haifa clip.mp4",
  },
  {
    id: 4,
    title: "All I want for Christmas",
    image: "/image/All I want for Christmas clip.webp",
    video: "/video/All I want for Christmas clip.mp4",
  },
  {
    id: 5,
    title: "Hypnotize",
    image: "/image/Hypnotize clip.webp",
    video: "/video/Hypnotize clip.mp4",
  },
  {
    id: 6,
    title: "Cover songs by SHAHOVA",
    image: "/image/Cover songs by SHAHOVA clip.webp",
    video: "/video/Cover songs by SHAHOVA clip.mp4",
  },
  {
    id: 7,
    title: "Parlo miro",
    image: "/image/Parlo miro clip.webp",
    video: "/video/Parlo Miro clip.mp4",
  },
  {
    id: 8,
    title: "Summer",
    image: "/image/Summer clip.webp",
    video: "/video/Summer clip.mp4",
  },
  {
    id: 9,
    title: "Tainted Love",
    image: "/image/Tainted Love clip.webp",
    video: "/video/Tainted Love clip.mp4",
  },
  {
    id: 10,
    title: "Birthday Party",
    image: "/image/Birthday Party clip.webp",
    video: "/video/Birthday Party clip.mp4",
  },
  {
    id: 11,
    title: "Stolen Dance",
    image: "/image/Stolen Dance clip.webp",
    video: "/video/Stolen Dance clip.mp4",
  },
  {
    id: 12,
    title: "Too Loud",
    image: "/image/Too Loud.webp",
    video: "/video/Too Loud.mp4",
  },
  {
    id: 13,
    title: "Moonlight",
    image: "/image/Moonlight.webp",
    video: "/video/Moonlight.mp4",
  },
];

export default function Carousel() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    image: string;
  } | null>(null);

  const [clipPathD, setClipPathD] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const speedRef = useRef(50); // px per sec
  const isVideoOpenRef = useRef(false);

  useEffect(() => {
    isVideoOpenRef.current = !!selectedVideo;
  }, [selectedVideo]);

  // Compute a perfect geometric clip-path for smooth, aliasing-free edges
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateClipPath = (W: number, H: number) => {
      if (W === 0 || H === 0) return;
      
      const isDesktop = window.innerWidth >= 768;
      const rx = W * 0.75;
      const sqrt5_3 = 0.74535599; // Math.sqrt(5) / 3
      
      const cy_top = isDesktop ? 14 : -1;
      const ry_top = isDesktop ? 70 : 55;
      const y_top_edge = cy_top + ry_top * sqrt5_3;
      
      const cy_bot = H - (isDesktop ? 29 : 14);
      const ry_bot = isDesktop ? 70 : 55;
      const y_bot_edge = cy_bot - ry_bot * sqrt5_3;
      
      setClipPathD(`M 0,${y_top_edge.toFixed(2)} A ${rx.toFixed(2)} ${ry_top} 0 0 0 ${W.toFixed(2)},${y_top_edge.toFixed(2)} L ${W.toFixed(2)},${y_bot_edge.toFixed(2)} A ${rx.toFixed(2)} ${ry_bot} 0 0 0 0,${y_bot_edge.toFixed(2)} Z`);
    };

    const obs = new ResizeObserver((entries) => {
      const target = entries[0].target as HTMLElement;
      updateClipPath(target.offsetWidth, target.offsetHeight);
    });
    
    obs.observe(containerRef.current);
    
    const handleResize = () => {
      if (containerRef.current) {
        updateClipPath(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    
    updateClipPath(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openVideo = (videoUrl: string, title: string, image: string) => {
    setSelectedVideo({ url: videoUrl, title, image });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Cap dt to prevent massive jumps if tab was inactive
      const safeDt = Math.min(dt, 50);

      // Advance offset if not interacted with
      if (
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !isVideoOpenRef.current
      ) {
        offsetRef.current += (speedRef.current * safeDt) / 1000;
      }

      if (setRef.current) {
        const setWidth = setRef.current.getBoundingClientRect().width;
        if (setWidth > 0) {
          // Seamless wrapping logic
          // We render 4 sets (0, 1, 2, 3). We keep offset between setWidth and setWidth * 2.
          if (offsetRef.current >= setWidth * 2) {
            offsetRef.current -= setWidth;
          } else if (offsetRef.current < setWidth) {
            offsetRef.current += setWidth;
          }
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerUp = () => {
      isDraggingRef.current = false;
      if (trackRef.current) {
        trackRef.current.style.cursor = "grab";
        trackRef.current.style.userSelect = "";
      }
      // Small delay to allow click event to be blocked if we dragged
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    lastXRef.current = e.pageX;

    const target = e.target as HTMLElement;
    if (target && target.setPointerCapture) {
      try {
        target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
      trackRef.current.style.userSelect = "none";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const x = e.pageX;
    const dx = x - lastXRef.current;

    if (Math.abs(x - startXRef.current) > 5) {
      hasDraggedRef.current = true;
    }

    offsetRef.current -= dx;
    lastXRef.current = x;
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      isHoveredRef.current = true;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      isHoveredRef.current = false;
    }
  };

  const handleCardClick = (e: React.MouseEvent, item: any) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    openVideo(item.video, item.title, item.image);
  };

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="carousel-clip">
            {clipPathD && <path d={clipPathD} />}
          </clipPath>
        </defs>
      </svg>
      <div
        ref={containerRef}
        className="relative w-full max-w-[100vw] overflow-hidden mt-12 py-10 touch-pan-y select-none"
        style={{
          clipPath: clipPathD ? 'url(#carousel-clip)' : 'none',
          WebkitClipPath: clipPathD ? 'url(#carousel-clip)' : 'none',
          transform: 'translateZ(0)' // Hardware acceleration
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)", cursor: "grab" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClickCapture={(e) => {
            if (hasDraggedRef.current) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        >
          {/* Render 4 sets to ensure seamless infinite scrolling in both directions */}
          {[0, 1, 2, 3].map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? setRef : null}
              className="flex gap-4 md:gap-[50px] pr-4 md:pr-[50px]"
            >
              {items.map((item, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="group relative h-[360px] w-[190px] md:h-[470px] md:w-[248px] flex-shrink-0 transition-transform duration-700 origin-center hover:scale-110 cursor-pointer overflow-hidden"
                  onClick={(e) => handleCardClick(e, item)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 190px, 248px"
                    priority={setIndex === 0 && i < 4}
                    draggable={false}
                    className="object-cover pointer-events-none"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    {/* Play Icon */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-red-600 flex items-center justify-center text-white mb-4 bg-red-600 transition-all duration-500 group-hover:scale-110 shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-sm translate-y-4 group-hover:translate-y-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg md:text-2xl uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-500 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={closeVideo}
        videoUrl={selectedVideo?.url || ""}
        title={selectedVideo?.title || ""}
        image={selectedVideo?.image}
      />
    </>
  );
}
