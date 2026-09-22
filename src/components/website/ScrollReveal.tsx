"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fade-up" | "fade" | "scale-up" | "slide-right" | "slide-left";
  delay?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
  staggerChildren?: number;
}

const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.75,
  className = "",
  viewportMargin = "-60px",
  staggerChildren,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: viewportMargin as any,
  });

  const getVariants = (): Variants => {
    switch (variant) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay, ease: EASING, staggerChildren },
          },
        };
      case "scale-up":
        return {
          hidden: { opacity: 0, scale: 0.95, y: 16 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration, delay, ease: EASING, staggerChildren },
          },
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -24 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: EASING, staggerChildren },
          },
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 24 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: EASING, staggerChildren },
          },
        };
      case "fade-up":
      default:
        return {
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: EASING, staggerChildren },
          },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
