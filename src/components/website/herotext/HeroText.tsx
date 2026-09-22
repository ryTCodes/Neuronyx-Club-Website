"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroTitleSegment {
  text: string;
  variant?: "normal" | "muted" | "gradient";
}

interface Heading2Segment {
  text: string;
  bold?: boolean;
}

export interface ComponentProps {
  title?: string;
  subtitle?: string;
  showPanel?: boolean;
  showHeroSection?: boolean;
  heroTitleSegments?: HeroTitleSegment[];
  heading2Segments?: Heading2Segment[];
  description?: string;
  showScrollIndicator?: boolean;
  scrollIndicatorText?: string;
}

const HERO_NODES: [number, number][] = [
  [8, 22],
  [18, 60],
  [30, 32],
  [44, 14],
  [58, 38],
  [72, 20],
  [86, 44],
  [92, 16],
  [66, 66],
  [40, 72],
  [22, 86],
  [80, 82],
];

const HERO_LINKS: [number, number][] = [
  [0, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 7],
  [5, 6],
  [4, 8],
  [8, 6],
  [1, 2],
  [1, 9],
  [9, 4],
  [9, 10],
  [8, 11],
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 1 + (i % 3),
  dur: 9 + (i % 5) * 2,
  delay: -(i * 1.3),
}));

export const Component = ({
  title = "NEURONYX",
  subtitle = "ACM Neuronyx Student Chapter",
  showScrollIndicator = true,
  scrollIndicatorText = "SCROLL TO EXPLORE",
}: ComponentProps) => {
  return (
    <div className="nx-root relative isolate flex min-h-screen w-full flex-col items-center justify-between overflow-hidden px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      <style>{CSS}</style>

      {/* Atmospheric grain overlay */}
      <div aria-hidden className="nx-grain" />

      {/* Atmospheric backdrop: glows, grids, celestial planet, constellation */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="nx-hero-glow absolute inset-0" />
        <div className="nx-grid absolute inset-0" />
        <div className="nx-planet hidden sm:block" />

        {/* Typographic watermark */}
        <span
          className="nx-ghost absolute bottom-[8%] right-[-2vw]"
          style={{ fontSize: "clamp(6rem, 20vw, 18rem)" }}
        >
          INTELLIGENCE
        </span>

        {/* Constellation Network */}
        <svg
          className="absolute inset-0 h-full w-full opacity-60"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {HERO_LINKS.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={HERO_NODES[a][0]}
              y1={HERO_NODES[a][1]}
              x2={HERO_NODES[b][0]}
              y2={HERO_NODES[b][1]}
              stroke="rgba(56,189,248,0.14)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Constellation Nodes */}
        {HERO_NODES.map(([x, y], i) => (
          <span
            key={i}
            className="nx-hnode"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${-i * 0.7}s`,
            }}
          />
        ))}

        {/* Ambient Rising Particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="nx-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>


      {/* Main Center Command Cluster */}
      <div className="relative z-10 my-auto flex max-w-4xl flex-col items-center text-center">
        {/* NeurOnyx Emblem Hero Badge with Levitation Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center justify-center"
        >
          <div className="group relative flex h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 items-center justify-center transition-all duration-500 hover:scale-105 animate-float-subtle">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[#168BFF]/20 blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            />
            <img
              src="/hero-logo.png"
              alt="NeurOnyx Logo"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_25px_rgba(22,139,255,0.4)] transition-transform duration-300"
            />
          </div>
        </motion.div>

        {/* Primary Super Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="nx-hero-title text-[#F8FAFC]"
        >
          {title === "NEURONYX" ? (
            <>
              NEUR
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#38BDF8,#22D3EE,#2563EB)]">
                ONYX
              </span>
            </>
          ) : (
            title
          )}
        </motion.h1>

        {/* Subtitle Telemetry */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="nx-mono mt-3 text-[11px] sm:text-xs font-medium tracking-[0.3em] uppercase text-[#38BDF8]"
        >
          {subtitle}
        </motion.p>

        {/* Required Exact Slogan: "From theory to impact building models that matter" */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-3xl px-2"
        >
          <p className="text-[clamp(1.15rem,2.5vw,1.95rem)] font-medium tracking-tight leading-relaxed text-[#94A3B8]">
            <span className="inline-block">
              <span className="text-[#F8FAFC]">From </span>
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#38BDF8,#22D3EE,#2563EB)] font-bold">
                theory
              </span>
              <span className="text-[#F8FAFC]"> to </span>
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#38BDF8,#22D3EE,#2563EB)] font-bold">
                impact
              </span>
            </span>{" "}
            <span className="inline-block">
              <span className="text-slate-400">building </span>
              <span className="text-[#F8FAFC] font-semibold underline decoration-[#22D3EE]/35 decoration-2 underline-offset-8">
                models that matter
              </span>
            </span>
          </p>
        </motion.div>

        {/* Interactive Cyber CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/events"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(90deg,#168BFF,#2563EB)] px-6 py-3 text-xs font-semibold tracking-[0.15em] text-white shadow-[0_0_25px_rgba(22,139,255,0.45)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.6)]"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0D1526]/80 px-6 py-3 text-xs font-semibold tracking-[0.15em] text-[#F8FAFC] backdrop-blur-md transition-all duration-300 hover:border-[#38BDF8]/50 hover:bg-[#101A30] hover:text-[#22D3EE]"
            >
              <span>CORE TEAM</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>


    </div>
  );
};

export { Component as HeroText };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700;800&display=swap');

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

.nx-root {
  position: relative;
  isolation: isolate;
  background: #05070D;
  color: #F8FAFC;
  font-family: 'Sora', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.nx-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.nx-grain {
  position: absolute;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.055;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.nx-hero-glow {
  background:
    radial-gradient(55% 45% at 82% 8%, rgba(22, 139, 255, 0.32), transparent 70%),
    radial-gradient(45% 40% at 8% 92%, rgba(34, 211, 238, 0.16), transparent 70%),
    radial-gradient(40% 35% at 50% 50%, rgba(37, 99, 235, 0.12), transparent 75%);
}

.nx-grid {
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: nx-pan 40s linear infinite;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%);
  mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%);
}

.nx-planet {
  position: absolute;
  right: -14vw;
  top: -24vw;
  width: 46vw;
  max-width: 720px;
  aspect-ratio: 1;
  border-radius: 9999px;
  background: radial-gradient(circle at 25% 75%, rgba(22, 139, 255, 0.20), rgba(5, 7, 13, 0) 62%);
  box-shadow: inset 0 0 90px rgba(56, 189, 248, 0.13), 0 0 0 1px rgba(56, 189, 248, 0.16);
}

.nx-ghost {
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.045em;
  white-space: nowrap;
  user-select: none;
  color: transparent;
  -webkit-text-stroke: 1px rgba(56, 189, 248, 0.075);
}

.nx-hero-title {
  font-size: clamp(3rem, 10vw, 8rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
  font-weight: 800;
}

.nx-hnode {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: #38BDF8;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px 1px rgba(56, 189, 248, 0.7);
  animation: nx-node-pulse 4s ease-in-out infinite;
}

.nx-particle {
  position: absolute;
  border-radius: 9999px;
  background: #22D3EE;
  opacity: 0;
  animation: nx-particle-rise linear infinite;
}

@keyframes nx-pan {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 64px 64px;
  }
}

@keyframes nx-node-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.6);
    opacity: 1;
  }
}

@keyframes nx-particle-rise {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-70px);
    opacity: 0;
  }
}

@keyframes nx-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

.nx-bounce {
  animation: nx-bounce 2.2s ease-in-out infinite;
}
`;

export default Component;