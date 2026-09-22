"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTeamMembers } from "@/lib/teamService";
import ScrollReveal from "../ScrollReveal";

function cx(...arr: (string | boolean | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

function Corners() {
  return (
    <>
      <span aria-hidden className="nx-corner tl" />
      <span aria-hidden className="nx-corner tr" />
      <span aria-hidden className="nx-corner bl" />
      <span aria-hidden className="nx-corner br" />
    </>
  );
}

const SQUADS = [
  {
    key: "technical",
    title: "Technical Team",
    desc: "The builders behind every system that ships — architectures, web engineering, and infrastructure.",
    accent: "#22D3EE",
  },
  {
    key: "data",
    title: "Data Team",
    desc: "Finding patterns inside complex datasets, training models, and driving applied ML experiments.",
    accent: "#22D3EE",
  },
  {
    key: "design",
    title: "Design Team",
    desc: "Shaping how NeurOnyx looks, reads, and feels through high-fidelity visual and product systems.",
    accent: "#168BFF",
  },
  {
    key: "media",
    title: "Media Team",
    desc: "Storytellers turning our research, workshops, and milestones into powerful broadcast signal.",
    accent: "#38BDF8",
  },
];

export default function TeamPreviewSection() {
  const [memberCount, setMemberCount] = useState<number>(27);
  const [leadershipCount, setLeadershipCount] = useState<number>(7);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const data = await getTeamMembers();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setMemberCount(data.length);
          const leaders = data.filter((m) => {
            const t = (m.Team || "").toUpperCase();
            const r = (m.role || "").toUpperCase();
            return (
              t.includes("HOD") ||
              t.includes("FACULTY") ||
              t.includes("PRESIDENT") ||
              t.includes("SECRETARY") ||
              t.includes("TREASURER") ||
              r.includes("PRESIDENT") ||
              r.includes("SECRETARY") ||
              r.includes("TREASURER")
            );
          });
          if (leaders.length > 0) {
            setLeadershipCount(leaders.length);
          }
        }
      } catch (err) {
        console.error("Failed to load team preview count from Firestore:", err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="team-preview"
      className="nx-root relative isolate overflow-hidden bg-[#05070D] py-24 sm:py-32 text-[#F8FAFC]"
    >
      <style>{CSS}</style>

      {/* Atmospheric grain & ambient glows */}
      <div aria-hidden className="nx-grain" />
      <div aria-hidden className="nx-grid-faint absolute inset-0 -z-10" />

      {/* Background radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[130px]"
          style={{ background: "#22D3EE" }}
        />
        <div
          className="absolute bottom-10 right-10 h-[450px] w-[450px] rounded-full opacity-20 blur-[130px]"
          style={{ background: "#168BFF" }}
        />
        <span
          className="nx-ghost absolute bottom-8 right-[-2vw] select-none text-[clamp(6rem,18vw,14rem)]"
        >
          MINDS
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER (Identical to About, Events, FAQ) ================= */}
        <ScrollReveal variant="fade-up" duration={0.8}>
          <header className="relative mb-14 sm:mb-20">
            <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
              <span aria-hidden className="nx-dot" />
              <span className="text-[#F8FAFC]">03</span>
              <span aria-hidden className="text-[#1E293B]">/</span>
              <span>TEAM</span>
              <span aria-hidden className="nx-rule h-px flex-1" />
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h2
                  id="team-title"
                  className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
                >
                  Meet The Minds
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
                  The architects, researchers, and creators behind NeurOnyx. Diverse minds pushing the frontiers of artificial intelligence and student computing at AIKTC.
                </p>
              </div>

              {/* Top redirect link */}
              <Link
                href="/teams"
                className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.15em] text-[#38BDF8] hover:text-[#22D3EE] transition-colors self-start lg:self-end"
              >
                <span>EXPLORE ALL {String(memberCount).padStart(2, "0")} MINDS</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </header>
        </ScrollReveal>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-stretch">
          {/* Left Column: Leadership Overview Card (Span 5) */}
          <ScrollReveal variant="scale-up" delay={0.1} duration={0.85} className="lg:col-span-5 flex flex-col">
            <div
              onMouseMove={onCardMouseMove}
              style={{ "--accent": "#168BFF" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between hover-subtle"
            >
              <Corners />

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                  Institutional Guidance &amp; Executive Command
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                  NeurOnyx operates as the official ACM Student Chapter under AIKTC's CSE(AIML) Department. Leadership combines academic mentorship with energetic student execution.
                </p>
              </div>

              {/* Quick Stats + Direct Route CTA */}
              <div className="mt-8 pt-6 border-t border-[#1E293B]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="nx-mono text-2xl font-bold text-[#F8FAFC]">
                      {String(leadershipCount).padStart(2, "0")}
                    </div>
                    <div className="nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">LEADERSHIP MINDS</div>
                  </div>
                  <div>
                    <div className="nx-mono text-2xl font-bold text-[#22D3EE]">04</div>
                    <div className="nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">EXEC SQUADS</div>
                  </div>
                </div>

                <Link
                  href="/teams"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#168BFF,#2563EB)] px-5 py-3 text-xs font-semibold tracking-[0.15em] text-white shadow-[0_0_20px_rgba(22,139,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                >
                  <span>MEET LEADERSHIP</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: 4 Squad Grid (Span 7) */}
          <ScrollReveal variant="fade-up" delay={0.18} duration={0.85} className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SQUADS.map((squad) => {
                return (
                  <div
                    key={squad.key}
                    onMouseMove={onCardMouseMove}
                    style={{ "--accent": squad.accent } as React.CSSProperties}
                    className="nx-card group relative p-5 sm:p-6 flex flex-col justify-between hover-subtle"
                  >
                    <Corners />

                    <div>
                      <h4 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                        {squad.title}
                      </h4>

                      <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                        {squad.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Grand Redirect Banner */}
            <div
              onMouseMove={onCardMouseMove}
              style={{ "--accent": "#22D3EE" } as React.CSSProperties}
              className="nx-card relative p-6 bg-[linear-gradient(180deg,#0D1526,#070B14)] border border-[#1E293B] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 hover-subtle"
            >
              <Corners />

              <div className="space-y-1 text-center sm:text-left">
                <div className="text-lg font-bold text-[#F8FAFC]">
                  {memberCount} Minds · 1 Direction · Continuous Innovation
                </div>
                <div className="text-xs text-[#94A3B8]">
                  Browse profiles, portfolios, and LinkedIn networks of our entire chapter team.
                </div>
              </div>

              <Link
                href="/teams"
                className="group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-xl border border-[#38BDF8]/40 bg-[#0A1020]/90 px-6 py-3 text-xs font-semibold tracking-[0.15em] text-[#F8FAFC] transition-all duration-300 hover:border-[#22D3EE] hover:bg-[#101A30] hover:text-[#22D3EE] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
              >
                <span>VISIT TEAMS</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700;800&display=swap');

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

.nx-grid-faint {
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent);
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

.nx-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(248, 250, 252, 0.85);
}

.nx-rule {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.55), rgba(30, 41, 59, 0.9) 28%, rgba(30, 41, 59, 0.15));
}

.nx-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 9999px;
  background: var(--accent, #22D3EE);
  box-shadow: 0 0 10px var(--accent, #22D3EE);
  animation: nx-node 3s ease-in-out infinite;
}

.nx-blink {
  animation: nx-blink 1.1s steps(2, start) infinite;
}

@keyframes nx-node {
  0%, 100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

@keyframes nx-blink {
  to {
    visibility: hidden;
  }
}

.nx-card {
  isolation: isolate;
  border: 1px solid rgba(30, 41, 59, 0.95);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(13, 21, 38, 0.94), rgba(10, 16, 32, 0.94));
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.35s, box-shadow 0.35s;
}

.nx-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s;
  background: radial-gradient(
    300px circle at var(--mx, 50%) var(--my, 0%),
    color-mix(in srgb, var(--accent) 18%, transparent),
    transparent 70%
  );
}

.nx-card::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  top: -1px;
  height: 1px;
  pointer-events: none;
  opacity: 0;
  transform: scaleX(0.25);
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.4s;
}

.nx-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 16%, transparent),
    0 20px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent);
}

.nx-card:hover::before {
  opacity: 1;
}

.nx-card:hover::after {
  opacity: 1;
  transform: none;
}

.nx-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 0 solid var(--accent);
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.nx-corner.tl {
  top: 12px;
  left: 12px;
  border-top-width: 1px;
  border-left-width: 1px;
}
.nx-corner.tr {
  top: 12px;
  right: 12px;
  border-top-width: 1px;
  border-right-width: 1px;
}
.nx-corner.bl {
  bottom: 12px;
  left: 12px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.nx-corner.br {
  bottom: 12px;
  right: 12px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

.group:hover .nx-corner {
  opacity: 1;
}
.group:hover .nx-corner.tl {
  transform: translate(-3px, -3px);
}
.group:hover .nx-corner.tr {
  transform: translate(3px, -3px);
}
.group:hover .nx-corner.bl {
  transform: translate(-3px, 3px);
}
.group:hover .nx-corner.br {
  transform: translate(3px, 3px);
}

@media (prefers-reduced-motion: reduce) {
  .nx-root *,
  .nx-root *::before,
  .nx-root *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
  .nx-card:hover {
    transform: none;
  }
}
`;
