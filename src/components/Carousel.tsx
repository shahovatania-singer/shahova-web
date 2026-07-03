"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
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
];

export default function Carousel() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    image: string;
  } | null>(null);

  const openVideo = (videoUrl: string, title: string, image: string) => {
    setSelectedVideo({ url: videoUrl, title, image });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="relative w-full max-w-[100vw] overflow-hidden mt-12 py-10">
        {/* Top Curve Geometry */}
        <div className="pointer-events-none absolute -top-[66px] md:-top-[56px] -left-[11%] md:-left-[25%] w-[122%] md:w-[150%] h-[84px] md:h-[140px] bg-[#0d0d0d] rounded-[100%] z-20" />

        {/* Bottom Curve Geometry */}
        <div className="pointer-events-none absolute -bottom-[44px] md:-bottom-[41px] -left-[10%] md:-left-[25%] w-[120%] md:w-[150%] h-[84px] md:h-[140px] bg-[#0d0d0d] rounded-[100%] z-20" />

        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          breakpoints={{
            768: { spaceBetween: 50 },
          }}
          slidesPerView="auto"
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          className="[&>.swiper-wrapper]:!ease-linear"
        >
          {items.map((item, i) => (
            <SwiperSlide key={i} className="!w-auto">
              <div
                className="group relative h-[360px] w-[190px] md:h-[470px] md:w-[248px] flex-shrink-0 transition-transform duration-700 origin-center hover:scale-110 cursor-pointer overflow-hidden"
                onClick={() => openVideo(item.video, item.title, item.image)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 text-center">
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
            </SwiperSlide>
          ))}
        </Swiper>
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
