"use client";

import { useEffect, useRef, useState } from "react";

export default function AmbientSpotlight() {
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const isVisible = useRef(false);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse / trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        currentPos.current = { x: e.clientX, y: e.clientY };
        if (spotlightRef.current) {
          spotlightRef.current.style.opacity = "1";
        }
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "0";
      }
    };

    // Smooth lerp loop
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const render = () => {
      if (spotlightRef.current && isVisible.current) {
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.08);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.08);

        spotlightRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }
      animFrameId.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={spotlightRef}
        style={{
          width: 700,
          height: 700,
          top: -350,
          left: -350,
          opacity: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.045) 0%, rgba(22, 139, 255, 0.02) 35%, transparent 70%)",
        }}
        className="pointer-events-none absolute rounded-full blur-2xl"
      />
    </div>
  );
}
