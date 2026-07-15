"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SpringOptions } from "framer-motion";

type StarsBackgroundProps = React.ComponentProps<"div"> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions; // kept for prop compatibility, though canvas uses simple easing
  starColor?: string;
};

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 70,
  transition,
  starColor = "#eae9e9ff",
  ...props
}: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create 1600 stars to match the original count (1000 + 400 + 200)
    const stars = Array.from({ length: 1200 }).map((_, i) => {
      // Stratify sizes to match the original 3 layers
      const size = i < 1000 ? 1 : i < 1400 ? 2 : 3;
      // Base speed depends on size (parallax depth effect)
      const baseSpeed = size === 1 ? 0.2 : size === 2 ? 0.4 : 0.6;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        // Map the original 'speed' prop to a reasonable canvas speed
        speedY: baseSpeed * (50 / speed),
        opacity: Math.random() * 0.8 + 0.2,
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = width / 2;
      const centerY = height / 2;
      targetMouseX = -(e.clientX - centerX) * factor;
      targetMouseY = -(e.clientY - centerY) * factor;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      // Smoothly interpolate mouse position (spring-like ease)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Draw background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = starColor;
      stars.forEach((star) => {
        star.y -= star.speedY; // Stars move up? Or down? Original moved y: [0, -2000], meaning they moved UP.

        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const parallaxX = mouseX * (star.size * 0.5);
        const parallaxY = mouseY * (star.size * 0.5);

        let drawX = star.x + parallaxX;
        let drawY = star.y + parallaxY;

        // Screen wrapping for parallax
        if (drawX < 0) drawX += width;
        if (drawX > width) drawX -= width;
        if (drawY < 0) drawY += height;
        if (drawY > height) drawY -= height;

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [factor, speed, starColor]);

  return (
    <div
      data-slot="stars-background"
      className={cn(
        "relative w-full h-full min-h-screen overflow-hidden bg-black",
        className,
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
