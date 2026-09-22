"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { getEvents } from "@/lib/eventService";
import type { Event } from "@/types/event";
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseEventDate(dateStr?: string): Date | null {
  if (!dateStr || dateStr.trim().toUpperCase() === "TBA") return null;
  const match = dateStr.match(/(\d{1,2})\w*\s+([A-Za-z]+),?\s+(\d{4})/);
  if (match) {
    const [, day, monthName, year] = match;
    const monthIndex = MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase()
    );
    if (monthIndex !== -1) return new Date(Number(year), monthIndex, Number(day));
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function parsePreviewDate(dateStr?: string) {
  if (!dateStr || dateStr.trim().toUpperCase() === "TBA") {
    return { day: "--", month: "TBA", year: "" };
  }
  const match = dateStr.match(/(\d{1,2})\w*\s+([A-Za-z]+),?\s+(\d{4})/);
  if (match) {
    const [, day, monthName, year] = match;
    return {
      day: day.padStart(2, "0"),
      month: monthName.slice(0, 3).toUpperCase(),
      year,
    };
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: months[d.getMonth()],
      year: String(d.getFullYear()),
    };
  }
  return { day: "--", month: "TBA", year: "" };
}

const UPCOMING_EVENT = {
  id: "hacktoon-1",
  title: "HackToon 1.0",
  category: "HACKATHON",
  status: "UPCOMING",
  badge: "FLAGSHIP HACKATHON",
  date: "28th March, 2026",
  day: "28",
  month: "MAR",
  year: "2026",
  duration: "6 Hours",
  location: "CSE(AIML) Dept, AIKTC New Panvel",
  description:
    "A premiere hackathon designed for First Year Engineering students to ignite technical creativity and competitive problem-solving. Brainstorm, architect, and deploy intelligent prototypes under direct mentorship.",
  tags: ["HackToon", "Hackathon", "FE Innovation", "InterCollege", "AI/ML"],
  imageUrl: "",
  accent: "#22D3EE",
};

const SECONDARY_UPCOMING = {
  id: "debate-comp",
  title: "Debate Competition",
  category: "COMMUNICATION & ETHICS",
  status: "UPCOMING",
  badge: "NEXT UP",
  date: "Date: TBA",
  duration: "6 Hours",
  location: "AIKTC, New Panvel",
  description:
    "An engaging clash of perspectives focusing on artificial intelligence ethics, modern tech paradigms, and computational futures.",
  tags: ["Debate", "CriticalThinking", "EthicsInAI"],
  accent: "#38BDF8",
};

export default function EventsPreviewSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getEvents();
        if (isMounted && data && data.length > 0) {
          const sorted = [...data].sort((a, b) => {
            const dateA = parseEventDate(a.date);
            const dateB = parseEventDate(b.date);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB.getTime() - dateA.getTime();
          });
          setEvents(sorted);
        }
      } catch (err) {
        console.error("Failed to load events for preview:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalCount = events.length > 0 ? events.length : 9;
  const upcomingCount =
    events.length > 0
      ? events.filter((e) => {
          const s = (e.status || "").toLowerCase();
          return s === "upcoming" || s === "ongoing";
        }).length
      : 2;

  const hasUpcoming = useMemo(() => {
    return events.some((e) => {
      const s = (e.status || "").toLowerCase();
      return s === "upcoming" || s === "ongoing";
    });
  }, [events]);

  const primary = useMemo(() => {
    if (events.length === 0) return null;
    const upcoming = events.find((e) => {
      const s = (e.status || "").toLowerCase();
      return s === "upcoming" || s === "ongoing";
    });
    // Show the most recent event if there are not any upcoming events
    return upcoming || events[0];
  }, [events]);

  const secondary = useMemo(() => {
    if (events.length <= 1) return null;
    const upcomingList = events.filter((e) => {
      const s = (e.status || "").toLowerCase();
      return s === "upcoming" || s === "ongoing";
    });
    if (upcomingList.length > 1) return upcomingList[1];
    // Show the second most recent event if there are not any upcoming events
    return events[1];
  }, [events]);

  const featured = primary
    ? {
        id: primary.id,
        title: primary.title,
        status: !hasUpcoming ? "MOST RECENT" : (primary.status || "upcoming").toUpperCase(),
        badge: !hasUpcoming
          ? "MOST RECENT EVENT"
          : (primary.status || "").toLowerCase() === "completed"
          ? "FEATURED EVENT"
          : "FLAGSHIP EVENT",
        date: primary.date,
        ...parsePreviewDate(primary.date),
        duration: primary.duration || "TBA",
        location: primary.location || "AIKTC, New Panvel",
        description: primary.description,
        tags: primary.tags || [],
        imageUrl: primary.imageUrl || "",
        accent: "#22D3EE",
      }
    : UPCOMING_EVENT;

  const secondaryItem = secondary
    ? {
        id: secondary.id,
        title: secondary.title,
        badge: !hasUpcoming
          ? "PREVIOUS EVENT"
          : (secondary.status || "").toLowerCase() === "completed"
          ? "RECENT EVENT"
          : "NEXT UP",
        date: secondary.date,
        duration: secondary.duration || "TBA",
        location: secondary.location || "AIKTC, New Panvel",
        description: secondary.description,
        tags: secondary.tags || [],
        accent: "#38BDF8",
      }
    : SECONDARY_UPCOMING;

  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="events-preview"
      className="nx-root relative isolate overflow-hidden bg-[#05070D] py-24 sm:py-32 text-[#F8FAFC]"
    >
      <style>{CSS}</style>

      {/* Atmospheric grain & ambient glows */}
      <div aria-hidden className="nx-grain" />
      <div aria-hidden className="nx-grid-faint absolute inset-0 -z-10" />

      {/* Background ambient radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-24 right-1/4 h-[480px] w-[480px] rounded-full opacity-20 blur-[130px]"
          style={{ background: "#168BFF" }}
        />
        <div
          className="absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "#22D3EE" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* ================= SECTION HEADER (Identical to About, Teams, FAQ) ================= */}
        <ScrollReveal variant="fade-up" duration={0.8}>
          <header className="relative mb-14 sm:mb-20">
            <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
              <span aria-hidden className="nx-dot" />
              <span className="text-[#F8FAFC]">02</span>
              <span aria-hidden className="text-[#1E293B]">/</span>
              <span>EVENTS</span>
              <span aria-hidden className="nx-rule h-px flex-1" />
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h2
                  id="events-title"
                  className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
                >
                  {hasUpcoming ? "Upcoming & Featured" : "Featured & Most Recent"}
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
                  {hasUpcoming
                    ? "Explore high-energy hackathons, expert-led bootcamps, and technical symposiums hosted by the NeurOnyx ACM Student Chapter."
                    : "Explore our latest tech symposiums, hackathons, and bootcamp archives hosted by the NeurOnyx ACM Student Chapter."}
                </p>
              </div>

              {/* Top redirect link */}
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.15em] text-[#38BDF8] hover:text-[#22D3EE] transition-colors self-start lg:self-end"
              >
                <span>EXPLORE ALL {String(totalCount).padStart(2, "0")} EVENTS</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </header>
        </ScrollReveal>

        {/* Main Grid: Featured Event + Companion Panel */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-stretch">
          {/* Primary Featured Event Card (Span 8) */}
          <ScrollReveal variant="scale-up" delay={0.1} duration={0.85} className="lg:col-span-8 flex flex-col">
            <div
              onMouseMove={onCardMouseMove}
              style={{ "--accent": featured.accent } as React.CSSProperties}
              className="nx-card group relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 flex-1 overflow-hidden hover-subtle"
            >
              <Corners />

            <div>
              {/* Card Meta Bar */}
              <div className="flex items-center justify-start border-b border-[#1E293B] pb-5">
                <span className="nx-mono rounded border border-[#1E293B] bg-[#05070D]/80 px-2.5 py-1 text-[10px] tracking-[0.2em] text-[#94A3B8]">
                  STATUS: {featured.status}
                </span>
              </div>

              {/* Event Content Grid */}
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
                {/* Visual Graphic Representation */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  {featured.imageUrl ? (
                    <div className="relative aspect-square w-full max-w-[240px] rounded-2xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center bg-[#05070D]">
                      <img
                        src={featured.imageUrl}
                        alt={featured.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex flex-col pointer-events-none">
                        <span className="nx-mono text-2xl font-extrabold text-[#F8FAFC]">
                          {featured.day}
                        </span>
                        <span className="nx-mono text-[10px] font-bold tracking-[0.25em] text-[#38BDF8]">
                          {featured.month} {featured.year}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-square w-full max-w-[240px] rounded-2xl border border-white/10 bg-[#05070D]/90 p-4 shadow-inner flex items-center justify-center overflow-hidden">
                      {/* SVG Futuristic Motif */}
                      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                        <circle
                          cx="100"
                          cy="100"
                          r="75"
                          fill="none"
                          stroke="#38BDF8"
                          strokeOpacity="0.25"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="52"
                          fill="none"
                          stroke="#22D3EE"
                          strokeOpacity="0.4"
                          strokeWidth="1.2"
                        />
                        <polygon
                          points="100,35 156,68 156,132 100,165 44,132 44,68"
                          fill="none"
                          stroke="#168BFF"
                          strokeOpacity="0.35"
                          strokeWidth="1"
                        />
                        <line x1="100" y1="35" x2="100" y2="165" stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1" />
                        <line x1="44" y1="100" x2="156" y2="100" stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1" />
                        
                        {/* Central Core */}
                        <circle cx="100" cy="100" r="10" fill="#0D1526" stroke="#22D3EE" strokeWidth="2" />
                        <circle cx="100" cy="100" r="4" fill="#38BDF8">
                          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                      </svg>

                      {/* Date Block Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="nx-mono text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                          {featured.day}
                        </span>
                        <span className="nx-mono text-xs font-bold tracking-[0.3em] text-[#38BDF8]">
                          {featured.month} {featured.year}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                      {featured.duration}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-[#38BDF8]" />
                      {featured.location}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                    {featured.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {featured.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="nx-mono rounded border border-[#1E293B] bg-[#05070D]/60 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[#1E293B] flex items-center justify-start">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#168BFF,#2563EB)] px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-white shadow-[0_0_20px_rgba(22,139,255,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
              >
                <span>VIEW EVENT & DETAILS</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

          {/* Companion Panel (Span 4) */}
          <ScrollReveal variant="fade-up" delay={0.2} duration={0.85} className="lg:col-span-4 flex flex-col justify-between gap-6">
            {/* Secondary Upcoming Event Teaser */}
            <div
              onMouseMove={onCardMouseMove}
              style={{ "--accent": secondaryItem.accent } as React.CSSProperties}
              className="nx-card group relative p-6 flex flex-col justify-between flex-1 hover-subtle"
            >
              <Corners />

              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#1E293B] pb-4">
                  <span className="nx-mono text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
                    {secondaryItem.badge}
                  </span>
                  <span className="nx-mono text-[10px] text-[#94A3B8]">
                    {secondaryItem.date}
                  </span>
                </div>

                <h4 className="mt-4 text-xl font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                  {secondaryItem.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                  {secondaryItem.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {secondaryItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="nx-mono rounded border border-[#1E293B] bg-[#05070D]/60 px-2 py-0.5 text-[9px] text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Archive Stats + Redirect Banner */}
            <div
              onMouseMove={onCardMouseMove}
              style={{ "--accent": "#168BFF" } as React.CSSProperties}
              className="nx-card relative p-6 bg-[linear-gradient(180deg,#0D1526,#070B14)] border border-[#1E293B] rounded-2xl hover-subtle"
            >
              <Corners />

              <div className="grid grid-cols-2 gap-4">
                <div className="border-l border-[#1E293B] pl-3">
                  <div className="nx-mono text-2xl font-bold text-[#F8FAFC]">
                    {String(totalCount).padStart(2, "0")}
                  </div>
                  <div className="nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">TOTAL EVENTS</div>
                </div>
                <div className="border-l border-[#1E293B] pl-3">
                  <div className="nx-mono text-2xl font-bold text-[#22D3EE]">
                    {String(upcomingCount).padStart(2, "0")}
                  </div>
                  <div className="nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">UPCOMING</div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/events"
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-[#38BDF8]/40 bg-[#0A1020]/90 px-4 py-3 text-xs font-semibold tracking-[0.15em] text-[#F8FAFC] transition-all duration-300 hover:border-[#22D3EE] hover:bg-[#101A30] hover:text-[#22D3EE] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
                >
                  <span>VISIT EVENTS</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
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
