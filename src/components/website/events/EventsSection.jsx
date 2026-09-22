"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { getEvents } from "@/lib/eventService";

/* ============================================================
   FALLBACK EVENT DATA
   Used as initial SSR/client state and offline fallback.
   Live event data is fetched dynamically from Firestore.
   ============================================================ */

const defaultEvents = [
  {
    title: "AIKTC-ACM Student Chapter and NeurOnyx Club Inauguration",
    date: "12th September, 2025",
    duration: "1.5 hours",
    description:
      "The NeurOnyx Club was officially launched under the ACM Student Chapter with a vibrant ceremony featuring faculty felicitations, logo and website unveiling, and the appointment of student leaders. The event introduced the club's mission in AI/ML and kicked off the \"Event Friday\" initiative.",
    tags: ["ACM", "Inauguration", "AI", "ML", "EventFriday", "ClubLaunch", "MLMatters"],
    status: "completed",
    location: "CO Seminar Hall, AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "Teacher’s Day Celebration",
    date: "12th September, 2025",
    duration: "2 hours",
    description:
      "Teacher’s Day was celebrated by the NeurOnyx Club to honor faculty members. The event included a cake-cutting ceremony, token gifts, and fun interactive games like Rapid Fire and Chit Game, strengthening the bond between students and teachers.",
    tags: ["TeachersDay", "NeurOnyx", "Faculty", "Celebration"],
    status: "completed",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "Engineer’s Day",
    date: "15th September, 2025",
    duration: "2 hours",
    description:
      "Celebrated by the NeurOnyx Club to honor Sir M. Visvesvaraya. The event featured Shark Tank, AI Image Generation, and networking activities, encouraging creativity and innovation among FE & SE students.",
    tags: ["EngineersDay", "SharkTank", "AI", "Innovation"],
    status: "completed",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "Build vs Break",
    date: "6th October, 2025",
    duration: "6 hours",
    description:
      "Build vs Break is an engaging, multi-stage event that challenges participants to test their problem-solving and creative skills. The event begins with a Quiz Round, followed by a Debug Round, and culminates in an AI-powered Build Round.",
    tags: ["BvB", "MiniHackathon", "Build", "Break", "Ideate", "ProblemSolving"],
    status: "completed",
    location: "CSE(AIML) Department, AIKTC, New Panvel",
    redirectUrl: "https://built-vs-break.web.app/",
    socialLinks: [],
  },
  {
    title: "Java Bootcamp – Expert Session",
    date: "14th October, 2025",
    duration: "Full Day",
    description:
      "Jointly organized by NeurOnyx and DataNexus Clubs. Conducted by Mr. Chirag Raul, focusing on Java fundamentals, OOP concepts, live coding, and career guidance for 70-80 students.",
    tags: ["Java", "Bootcamp", "OOP", "Coding", "DataNexus"],
    status: "completed",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "React.js Beginner Workshop",
    date: "4th January, 2026",
    duration: "2 hours",
    description:
      "A beginner-friendly online session conducted by Huzaifa Ansari. Covered JavaScript basics, JSX, components, props, state, Hooks, and routing to build a strong frontend foundation.",
    tags: ["ReactJS", "Frontend", "WebDev", "Workshop", "Hooks"],
    status: "completed",
    location: "Online",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "Expert Session – AI Special",
    date: "10th March, 2026",
    duration: "2 hours",
    description:
      "An exclusive AI expert session conducted by a distinguished industry professional invited by Ideabas. Coordinated by Abdul Majid Sir, focusing on AI trends and real-world applications.",
    tags: ["AI", "ExpertSession", "Career", "Trends"],
    status: "completed",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "Debate Competition",
    date: "TBA",
    duration: "6 hours",
    description:
      "An engaging competition aimed at enhancing communication and critical thinking. Participants debate on trending technical, social, and AI-related topics.",
    tags: ["Debate", "Communication", "SoftSkills", "CriticalThinking"],
    status: "upcoming",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
  {
    title: "HackToon 1.0",
    date: "28th March, 2026",
    duration: "6 hours",
    description:
      "A hackathon designed for First Year Engineering students to encourage innovation and technical creativity. A competitive platform to build solutions and brainstorm ideas.",
    tags: ["HackToon", "Hackathon", "FE", "Innovation", "InterCollege"],
    status: "upcoming",
    location: "AIKTC, New Panvel",
    redirectUrl: "",
    socialLinks: [],
  },
];

/* ============================================================
   UTILITIES
   ============================================================ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isTBA(dateStr) {
  return !dateStr || String(dateStr).trim().toUpperCase() === "TBA";
}

function parseEventDate(dateStr) {
  if (isTBA(dateStr)) return null;
  const str = String(dateStr);
  const match = str.match(/(\d{1,2})\w*\s+([A-Za-z]+),?\s+(\d{4})/);
  if (match) {
    const [, day, monthName, year] = match;
    const monthIndex = MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase()
    );
    if (monthIndex !== -1) return new Date(Number(year), monthIndex, Number(day));
  }
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function editorialDate(dateStr) {
  if (isTBA(dateStr)) return { day: null, month: null, year: null, tba: true };
  const str = String(dateStr);
  const match = str.match(/(\d{1,2})\w*\s+([A-Za-z]+),?\s+(\d{4})/);
  if (match) {
    const [, day, monthName, year] = match;
    return {
      day: day.padStart(2, "0"),
      month: monthName.slice(0, 3).toUpperCase(),
      year,
      tba: false,
    };
  }
  const fallback = new Date(str);
  if (!isNaN(fallback.getTime())) {
    return {
      day: String(fallback.getDate()).padStart(2, "0"),
      month: MONTHS[fallback.getMonth()].slice(0, 3).toUpperCase(),
      year: String(fallback.getFullYear()),
      tba: false,
    };
  }
  return { day: null, month: null, year: null, tba: true };
}

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

/* ============================================================
   ICONS (inline SVG — no dependencies)
   ============================================================ */

const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

const IconArrow = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChevron = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
);

const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32z" />
  </svg>
);

const IconGitHub = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconYouTube = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const IconDiscord = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const IconGlobe = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

function getSocialInfo(url) {
  const u = String(url || "").toLowerCase();
  if (u.includes("instagram.com")) return { name: "Instagram", icon: IconInstagram };
  if (u.includes("linkedin.com")) return { name: "LinkedIn", icon: IconLinkedIn };
  if (u.includes("github.com")) return { name: "GitHub", icon: IconGitHub };
  if (u.includes("twitter.com") || u.includes("x.com")) return { name: "X", icon: IconX };
  if (u.includes("youtube.com") || u.includes("youtu.be")) return { name: "YouTube", icon: IconYouTube };
  if (u.includes("discord.gg") || u.includes("discord.com")) return { name: "Discord", icon: IconDiscord };
  return { name: "Website", icon: IconGlobe };
}

/* ============================================================
   GENERATED EVENT VISUALS
   No image files anywhere — every visual is CSS + inline SVG,
   built from the NeurOnyx palette, with a motif chosen to match
   the nature of each event.
   ============================================================ */

const PALETTE = { blue: "#168BFF", cyan: "#22D3EE", azure: "#38BDF8", royal: "#2563EB" };
const ACCENTS = [PALETTE.azure, PALETTE.cyan, PALETTE.blue, PALETTE.royal];
const accentFor = (i) => ACCENTS[i % ACCENTS.length];

function VisualFrame({ accent, children }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(130% 100% at 18% 10%, ${accent}26, transparent 55%), linear-gradient(155deg, #0D1526 0%, #05070D 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 85% 90%, ${accent}1c, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

/* PEOPLE → IDEAS → TECHNOLOGY → IMPACT | brand mark for the club launch */
function BrandMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g className="animate-[spin_26s_linear_infinite]" style={{ transformOrigin: "200px 150px" }}>
          <circle cx="200" cy="150" r="98" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="200" cy="150" r="66" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="4 7" />
        </g>
        <circle cx="200" cy="150" r="34" fill="none" stroke={accent} strokeWidth="1.5" />
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 98;
          const y = 150 + Math.sin(rad) * 98;
          return (
            <circle key={deg} cx={x} cy={y} r="4" fill={accent}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" begin={`${deg / 90}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
        <text x="200" y="168" textAnchor="middle" fontSize="64" fontWeight="700" fill="#F8FAFC" fillOpacity="0.9" fontFamily="inherit">
          NX
        </text>
      </svg>
    </VisualFrame>
  );
}

/* Teacher's Day — elegant celebratory motif: soft sparkles + ribbon arc */
function CelebrationMotif({ accent }) {
  const sparkles = [
    [70, 70], [330, 60], [60, 220], [340, 210], [200, 40], [110, 150], [300, 150],
  ];
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <path
          d="M40 220 C 140 120, 260 120, 360 220"
          fill="none"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <path
          d="M40 240 C 140 140, 260 140, 360 240"
          fill="none"
          stroke={accent}
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        {sparkles.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path
              d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
              fill={i % 2 === 0 ? accent : "#F8FAFC"}
              fillOpacity={i % 2 === 0 ? 0.85 : 0.5}
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        <text x="200" y="172" textAnchor="middle" fontSize="46" fontWeight="600" fill="#F8FAFC" fillOpacity="0.1" letterSpacing="8">
          THANK YOU
        </text>
      </svg>
    </VisualFrame>
  );
}

/* Engineer's Day — blueprint grid + rotating hex, technical drafting feel */
function EngineeringMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke={accent} strokeOpacity="0.18" strokeWidth="1">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`d${i}`} x1={-40 + i * 70} y1="0" x2={i * 70 + 260} y2="300" />
          ))}
        </g>
        <g className="animate-[spin_30s_linear_infinite]" style={{ transformOrigin: "200px 150px" }}>
          <polygon
            points="200,86 256,118 256,182 200,214 144,182 144,118"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
        </g>
        <polygon
          points="200,110 240,133 240,177 200,200 160,177 160,133"
          fill={accent}
          fillOpacity="0.08"
          stroke={accent}
          strokeOpacity="0.6"
          strokeWidth="1"
        />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="200" y1="150"
            x2={200 + Math.cos((deg * Math.PI) / 180) * 30}
            y2={150 + Math.sin((deg * Math.PI) / 180) * 30}
            stroke={accent}
            strokeOpacity="0.5"
          />
        ))}
        {/* ruler ticks */}
        <g stroke="#94A3B8" strokeOpacity="0.4">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`t${i}`} x1={30 + i * 30} y1="270" x2={30 + i * 30} y2={i % 3 === 0 ? 258 : 264} />
          ))}
        </g>
      </svg>
    </VisualFrame>
  );
}

/* Hackathons (Build vs Break / HackToon) — terminal window with typed lines */
function HackathonMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect x="48" y="58" width="304" height="184" rx="10" fill="#0A1020" stroke={accent} strokeOpacity="0.35" />
        <rect x="48" y="58" width="304" height="30" rx="10" fill="#0D1526" stroke={accent} strokeOpacity="0.2" />
        {["#EF4444", "#F59E0B", "#10B981"].map((c, i) => (
          <circle key={c} cx={68 + i * 16} cy="73" r="4" fill={c} fillOpacity="0.8" />
        ))}
        <g fontFamily="monospace" fontSize="12" fill={accent} fillOpacity="0.8">
          <text x="66" y="112">$ init --build</text>
          <text x="66" y="134" fillOpacity="0.5">compiling modules...</text>
          <text x="66" y="156" fillOpacity="0.65">$ run quiz -&gt; debug -&gt; build</text>
        </g>
        <rect x="66" y="172" width="140" height="10" rx="2" fill={accent} fillOpacity="0.18" />
        <rect x="66" y="172" width="86" height="10" rx="2" fill={accent} fillOpacity="0.5" />
        <rect x="66" y="196" width="10" height="16" fill={accent}>
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>
        <path d="M280 100 L300 116 L280 132" fill="none" stroke={accent} strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </VisualFrame>
  );
}

/* Java Bootcamp — large braces, scanning code line, dot grid */
function CodeMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <text x="112" y="200" fontSize="180" fontWeight="700" fill="#F8FAFC" fillOpacity="0.08" fontFamily="monospace">
          {"{"}
        </text>
        <text x="230" y="200" fontSize="180" fontWeight="700" fill="#F8FAFC" fillOpacity="0.08" fontFamily="monospace">
          {"}"}
        </text>
        <g fontFamily="monospace" fontSize="13" fill={accent} fillOpacity="0.75">
          <text x="150" y="120">class Session {"{"}</text>
          <text x="168" y="144" fillOpacity="0.55">learn();</text>
          <text x="168" y="166" fillOpacity="0.55">build();</text>
          <text x="150" y="188">{"}"}</text>
        </g>
        <rect x="60" y="230" width="280" height="1" fill={accent} fillOpacity="0.25" />
        <rect x="60" y="228" width="2" height="6" fill={accent}>
          <animate attributeName="x" values="60;336;60" dur="4.5s" repeatCount="indefinite" />
        </rect>
      </svg>
    </VisualFrame>
  );
}

/* React Workshop — orbiting rings around a core node, component/orbit motif */
function ComponentMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(200 150)">
          {[0, 60, 120].map((deg, i) => (
            <ellipse
              key={deg}
              cx="0" cy="0" rx="100" ry="38"
              fill="none"
              stroke={accent}
              strokeOpacity={0.55 - i * 0.1}
              strokeWidth="1.4"
              transform={`rotate(${deg})`}
              className="animate-[spin_18s_linear_infinite]"
              style={{ transformOrigin: "0px 0px", animationDirection: i % 2 ? "reverse" : "normal" }}
            />
          ))}
          <circle r="10" fill={accent} />
          <circle r="16" fill="none" stroke={accent} strokeOpacity="0.4" />
        </g>
        {["&lt;/&gt;", "props", "state"].map((label, i) => (
          <text
            key={label}
            x={90 + i * 110}
            y={260}
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
            fill="#94A3B8"
            fillOpacity="0.55"
          >
            {label}
          </text>
        ))}
      </svg>
    </VisualFrame>
  );
}

/* AI Expert Session — layered neural network, pulsing nodes */
function NeuralMotif({ accent }) {
  const layers = [
    [70, 100, 150, 200],
    [150, 200, 250],
    [70, 130, 190, 230],
  ];
  const xs = [110, 200, 290];
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke={accent} strokeOpacity="0.22" strokeWidth="1">
          {layers[0].map((y1) =>
            layers[1].map((y2, j) => (
              <line key={`${y1}-${j}`} x1={xs[0]} y1={y1} x2={xs[1]} y2={y2} />
            ))
          )}
          {layers[1].map((y1) =>
            layers[2].map((y2, j) => (
              <line key={`b${y1}-${j}`} x1={xs[1]} y1={y1} x2={xs[2]} y2={y2} />
            ))
          )}
        </g>
        {layers.map((layer, li) =>
          layer.map((y, i) => (
            <circle key={`${li}-${i}`} cx={xs[li]} cy={y} r={li === 1 ? 5 : 4} fill={accent}>
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur={`${2.6 + ((li + i) % 4) * 0.35}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))
        )}
      </svg>
    </VisualFrame>
  );
}

/* Debate Competition — typographic quote / dialogue motif */
function TypographyMotif({ accent }) {
  return (
    <VisualFrame accent={accent}>
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <text x="60" y="180" fontSize="140" fontWeight="700" fill={accent} fillOpacity="0.18" fontFamily="serif">
          “
        </text>
        <text x="230" y="230" fontSize="140" fontWeight="700" fill="#F8FAFC" fillOpacity="0.1" fontFamily="serif">
          ”
        </text>
        <g stroke="#94A3B8" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round">
          <line x1="150" y1="120" x2="270" y2="120" />
          <line x1="150" y1="140" x2="240" y2="140" />
        </g>
        <path
          d="M110 190 h70 v34 l-20 -14 h-50 a10 10 0 0 1 -10 -10 v-0 a10 10 0 0 1 10 -10 Z"
          fill="none"
          stroke={accent}
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        <path
          d="M290 90 h-70 v34 l20 -14 h50 a10 10 0 0 0 10 -10 v0 a10 10 0 0 0 -10 -10 Z"
          fill="none"
          stroke="#F8FAFC"
          strokeOpacity="0.3"
          strokeWidth="1.4"
        />
      </svg>
    </VisualFrame>
  );
}

const MOTIF_COMPONENTS = {
  brand: BrandMotif,
  celebration: CelebrationMotif,
  engineering: EngineeringMotif,
  hackathon: HackathonMotif,
  code: CodeMotif,
  component: ComponentMotif,
  neural: NeuralMotif,
  typography: TypographyMotif,
};

const MOTIF_MAP = [
  "brand",        // 0 Inauguration
  "celebration",  // 1 Teacher's Day
  "engineering",  // 2 Engineer's Day
  "hackathon",    // 3 Build vs Break
  "code",         // 4 Java Bootcamp
  "component",    // 5 React Workshop
  "neural",       // 6 Expert Session – AI
  "typography",   // 7 Debate
  "hackathon",    // 8 HackToon
];

function EventVisual({ index = 0, imageUrl, title }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={title || "Event visual"}
        onError={() => setImgError(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  const motif = MOTIF_MAP[index % MOTIF_MAP.length];
  const Motif = MOTIF_COMPONENTS[motif] || BrandMotif;
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Motif accent={accentFor(index)} />
    </div>
  );
}

/* ============================================================
   SHARED PIECES
   ============================================================ */

function StatusDot({ status }) {
  const s = (status || "").toLowerCase();
  const isCompleted = s === "completed";
  const isOngoing = s === "ongoing";
  const label = isCompleted ? "COMPLETED" : isOngoing ? "ONGOING" : "UPCOMING";
  const dotColor = isCompleted ? "bg-emerald-400" : isOngoing ? "bg-cyan-400" : "bg-amber-400";
  const textColor = isCompleted ? "text-emerald-300" : isOngoing ? "text-cyan-300" : "text-amber-300";
  const shadowColor = isCompleted
    ? "rgba(16,185,129,0.6)"
    : isOngoing
    ? "rgba(34,211,238,0.6)"
    : "rgba(245,158,11,0.6)";

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
      <span
        className={classNames("h-1.5 w-1.5 rounded-full", dotColor)}
        style={{
          boxShadow: `0 0 6px 1px ${shadowColor}`,
        }}
      />
      <span className={textColor}>{label}</span>
    </span>
  );
}

function DateBlock({ date, size = "md" }) {
  const d = editorialDate(date);
  if (d.tba) {
    return (
      <div className="flex flex-col leading-none">
        <span
          className={classNames(
            "font-semibold tracking-wide text-slate-200",
            size === "lg" ? "text-lg" : "text-sm"
          )}
        >
          TBA
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col leading-none">
      <span
        className={classNames(
          "font-semibold text-white",
          size === "lg" ? "text-4xl" : "text-2xl"
        )}
      >
        {d.day}
      </span>
      <span
        className={classNames(
          "mt-1 tracking-[0.2em] text-sky-400",
          size === "lg" ? "text-xs" : "text-[10px]"
        )}
      >
        {d.month}
      </span>
      <span
        className={classNames(
          "mt-0.5 tracking-wide text-slate-500",
          size === "lg" ? "text-xs" : "text-[10px]"
        )}
      >
        {d.year}
      </span>
    </div>
  );
}

function TagPill({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400">
      {children}
    </span>
  );
}

/* ============================================================
   1 + 2 — EVENTS HERO (Matching /teams style)
   ============================================================ */

const HERO_NODES = [
  [8, 22], [18, 60], [30, 32], [44, 14], [58, 38], [72, 20],
  [86, 44], [92, 16], [66, 66], [40, 72], [22, 86], [80, 82],
];
const HERO_LINKS = [
  [0, 2], [2, 3], [3, 4], [4, 5], [5, 7], [5, 6], [4, 8],
  [8, 6], [1, 2], [1, 9], [9, 4], [9, 10], [8, 11],
];
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 1 + (i % 3),
  dur: 9 + (i % 5) * 2,
  delay: -(i * 1.3),
}));

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="nx-hero-glow absolute inset-0" />
      <div className="nx-grid absolute inset-0" />
      <div className="nx-planet hidden sm:block" />

      <span className="nx-ghost absolute bottom-[4%] right-[-1vw]" style={{ fontSize: "clamp(6rem, 21vw, 19rem)" }}>
        EVENTS
      </span>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {HERO_LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={HERO_NODES[a][0]}
            y1={HERO_NODES[a][1]}
            x2={HERO_NODES[b][0]}
            y2={HERO_NODES[b][1]}
            stroke="rgba(56,189,248,0.13)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {HERO_NODES.map(([x, y], i) => (
        <span key={i} className="nx-hnode" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${-i * 0.7}s` }} />
      ))}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="nx-particle"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}

function EventHero({ stats }) {
  return (
    <section aria-labelledby="events-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <HeroBackdrop />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F8FAFC]">
            NEUR<span className="text-[#22D3EE]">ONYX</span>
            <span className="ml-3 font-normal text-[#94A3B8]">EVENTS</span>
          </p>
          <p className="nx-mono hidden text-[10px] tracking-[0.35em] text-[#38BDF8] sm:block">
            BUILD · CONNECT · INNOVATE
          </p>
        </div>

        {/* headline */}
        <div className="flex flex-1 items-center py-16 sm:py-20">
          <div className="w-full max-w-3xl">
            <h1 id="events-title" className="nx-hero-title text-[#F8FAFC]">
              <span className="block max-sm:text-[2.4rem] whitespace-nowrap">WHERE IDEAS</span>
              <span className="block max-sm:text-[2.4rem] whitespace-nowrap">BECOME IMPACT</span>
            </h1>

            <div className="mt-8 h-px w-40 bg-[linear-gradient(90deg,#38BDF8,#22D3EE,#2563EB)] sm:w-64" aria-hidden />

            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#94A3B8] sm:text-xl">
              <span className="text-[#F8FAFC]">Events, workshops, and competitions.</span> Where the NeurOnyx community learns, builds, debates and innovates.
            </p>
          </div>
        </div>

        {/* stats */}
        <div className="pb-10 sm:pb-12">
          <dl className="grid grid-cols-2 border-t border-[#1E293B] sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-b border-[#1E293B]/70 py-5 pr-4 sm:border-b-0">
                <dt className="nx-mono text-[10px] tracking-[0.25em] text-[#94A3B8]">{s.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-[#F8FAFC]">
                  {String(s.value).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4 — FEATURED EVENT
   ============================================================ */

function FeaturedEvent({ event, featuredIndex = 0, totalCount = 9, isRecentFallback = false, onOpen }) {
  if (!event) return null;

  return (
    <section className="bg-[#05070D] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-center gap-3 text-[11px] tracking-[0.25em] text-slate-500">
          <span className="text-sky-400">
            {isRecentFallback ? "FEATURED · MOST RECENT" : "FEATURED"}
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span>01 / {String(totalCount).padStart(2, "0")}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <EventVisual
                index={featuredIndex >= 0 ? featuredIndex : 0}
                imageUrl={event.imageUrl}
                title={event.title}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,7,13,0) 40%, rgba(5,7,13,0.85) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.5), 0 0 40px rgba(56,189,248,0.12)" }}
            />
            <div className="absolute bottom-5 left-5">
              <StatusDot status={event.status} />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:pl-10">
            <div className="mb-6 flex items-center gap-4">
              <DateBlock date={event.date} size="lg" />
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <IconClock className="h-4 w-4" />
                {event.duration}
              </div>
            </div>

            <h3 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
              {event.title}
            </h3>

            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-400">
              {event.description}
            </p>

            <div className="mt-5 flex items-center gap-1.5 text-sm text-slate-500">
              <IconPin className="h-4 w-4 shrink-0" />
              {event.location}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {event.tags.slice(0, 5).map((t) => (
                <TagPill key={t}>{t}</TagPill>
              ))}
            </div>

            <button
              onClick={() => onOpen(event)}
              className="group mt-9 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-sky-400/50 hover:bg-sky-400/[0.06]"
            >
              View details
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   11 + 12 — EVENT EXPLORER (search / filter / sort)
   ============================================================ */

function EventExplorer({ query, setQuery, statusFilter, setStatusFilter, tagFilter, setTagFilter, sortBy, setSortBy, tagOptions, resultCount, isUpcomingFallback }) {
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const tagRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (tagRef.current && !tagRef.current.contains(e.target)) setTagMenuOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sortLabels = { newest: "Newest", oldest: "Oldest", az: "A – Z" };

  return (
    <section className="bg-[#0A1020] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-3 text-[11px] tracking-[0.25em] text-slate-500">
          <span className="text-sky-400">EVENT EXPLORER</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* search */}
          <label className="relative flex-1">
            <span className="sr-only">Search events</span>
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tag, location…"
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400/50"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {/* status filter */}
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              {["all", "completed", "ongoing", "upcoming"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={classNames(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                    statusFilter === s
                      ? "bg-sky-400/15 text-sky-300"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* category filter */}
            <div className="relative" ref={tagRef}>
              <button
                onClick={() => setTagMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20"
              >
                {tagFilter === "all" ? "Category" : tagFilter}
                <IconChevron className="h-3.5 w-3.5" />
              </button>
              {tagMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 max-h-64 w-52 overflow-y-auto rounded-xl border border-white/10 bg-[#0D1526] p-1.5 shadow-2xl">
                  <button
                    onClick={() => { setTagFilter("all"); setTagMenuOpen(false); }}
                    className={classNames(
                      "block w-full rounded-lg px-3 py-2 text-left text-xs",
                      tagFilter === "all" ? "bg-sky-400/10 text-sky-300" : "text-slate-400 hover:bg-white/[0.04]"
                    )}
                  >
                    All categories
                  </button>
                  {tagOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTagFilter(t); setTagMenuOpen(false); }}
                      className={classNames(
                        "block w-full rounded-lg px-3 py-2 text-left text-xs",
                        tagFilter === t ? "bg-sky-400/10 text-sky-300" : "text-slate-400 hover:bg-white/[0.04]"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20"
              >
                Sort · {sortLabels[sortBy]}
                <IconChevron className="h-3.5 w-3.5" />
              </button>
              {sortMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-white/10 bg-[#0D1526] p-1.5 shadow-2xl">
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setSortMenuOpen(false); }}
                      className={classNames(
                        "block w-full rounded-lg px-3 py-2 text-left text-xs",
                        sortBy === key ? "bg-sky-400/10 text-sky-300" : "text-slate-400 hover:bg-white/[0.04]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 text-xs text-slate-500">
          {isUpcomingFallback ? (
            <span className="text-amber-300 font-medium">
              No upcoming events currently scheduled — showing the most recent event:
            </span>
          ) : (
            <span>
              {resultCount} {resultCount === 1 ? "event" : "events"} found
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   7 + 8 + 9 + 10 — EVENT CARD
   ============================================================ */

function EventCard({ event, number, variant, onOpen }) {
  const isLarge = variant === "large";
  const isWide = variant === "wide";

  return (
    <button
      onClick={() => onOpen(event)}
      className={classNames(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1526]/60 text-left transition-colors duration-300 hover:border-sky-400/40 w-full h-full",
        isWide && "md:flex-row"
      )}
    >
      <div
        className={classNames(
          "relative overflow-hidden shrink-0",
          isWide
            ? "aspect-[16/9] md:aspect-auto md:w-5/12 min-h-[220px]"
            : isLarge
            ? "aspect-[16/10]"
            : "aspect-[16/10]"
        )}
      >
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          <EventVisual index={number - 1} imageUrl={event.imageUrl} title={event.title} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,7,13,0) 45%, rgba(5,7,13,0.9) 100%)" }}
        />
        <div className="absolute bottom-4 left-4">
          <StatusDot status={event.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <DateBlock date={event.date} />
          <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
            <IconClock className="h-3.5 w-3.5" />
            {event.duration}
          </div>
        </div>

        <h4
          className={classNames(
            "mt-4 font-semibold text-white transition-transform duration-300 group-hover:translate-x-0.5",
            isLarge || isWide ? "text-xl sm:text-2xl" : "text-base font-semibold"
          )}
        >
          {event.title}
        </h4>

        <p
          className={classNames(
            "mt-2 text-slate-400",
            isLarge || isWide ? "text-sm leading-relaxed line-clamp-3" : "text-[13px] leading-relaxed line-clamp-2"
          )}
        >
          {event.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <IconPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(event.tags || []).slice(0, isLarge || isWide ? 4 : 3).map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium text-sky-400">
          View details
          <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.35), 0 0 30px rgba(56,189,248,0.08)" }}
      />
    </button>
  );
}

/* ============================================================
   6 — EVENT ARCHIVE BENTO GRID
   ============================================================ */

const BENTO_LAYOUT = [
  { span: "col-span-1 md:col-span-2 lg:col-span-2", variant: "large" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-2 lg:col-span-3", variant: "wide" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-1 lg:col-span-1", variant: "normal" },
  { span: "col-span-1 md:col-span-2 lg:col-span-1", variant: "normal" },
];

function EventGrid({ items, allEvents, onOpen }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-24 text-center">
        <p className="text-sm text-slate-500">No events match your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((event, index) => {
        const layout = BENTO_LAYOUT[index % BENTO_LAYOUT.length];
        const originalIndex = allEvents ? allEvents.indexOf(event) : index;
        const number = (originalIndex >= 0 ? originalIndex : index) + 1;
        return (
          <div key={event.id || event.title + event.date} className={classNames(layout.span, "flex")}>
            <EventCard
              event={event}
              number={number}
              variant={layout.variant}
              onOpen={onOpen}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   13 + 14 — EVENT MODAL
   ============================================================ */

function EventModal({ event, allEvents, onClose }) {
  const closeRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!event) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [event, onClose]);

  if (!mounted || !event || typeof document === "undefined") return null;
  const originalIndex = allEvents ? allEvents.indexOf(event) : -1;
  const number = (originalIndex >= 0 ? originalIndex : 0) + 1;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={onClose}
        style={{ zIndex: 99999 }}
        className="fixed inset-0 bg-[#05070D]/90 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]"
      />

      <div
        style={{ zIndex: 100000 }}
        className="relative my-auto max-h-[85svh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0A1020] shadow-2xl animate-[modalIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Sticky close button container: stays pinned at top right of the card even when scrolled */}
        <div className="sticky top-0 z-30 flex justify-end p-3 pointer-events-none -mb-12">
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close event details"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#05070D]/85 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:border-sky-400 hover:bg-[#05070D] focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <EventVisual index={number - 1} imageUrl={event.imageUrl} title={event.title} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,16,32,0) 40%, rgba(10,16,32,0.95) 100%)" }}
          />
          <div className="absolute bottom-5 left-6">
            <StatusDot status={event.status} />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <DateBlock date={event.date} size="lg" />
            <div className="h-12 w-px bg-white/10" />
            <div className="flex flex-col gap-1.5 pt-1 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <IconClock className="h-4 w-4" /> {event.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <IconPin className="h-4 w-4" /> {event.location}
              </span>
            </div>
          </div>

          <h2 id="event-modal-title" className="mt-6 text-2xl font-semibold leading-snug text-white sm:text-[28px]">
            {event.title}
          </h2>

          <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
            {event.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {(event.tags || []).map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {event.redirectUrl && (
              <a
                href={event.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-[#05070D] transition-transform hover:scale-[1.02]"
                style={{ backgroundImage: "linear-gradient(90deg, #38BDF8, #22D3EE)" }}
              >
                Visit event site
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}

            {event.socialLinks && event.socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {event.socialLinks.map((link, idx) => {
                  const { name, icon: IconComponent } = getSocialInfo(link);
                  return (
                    <a
                      key={link + idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-300 transition-all duration-200 hover:scale-105 hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700;800&display=swap');

.nx-root { position: relative; isolation: isolate; overflow-x: clip; background: #05070D; color: #F8FAFC;
  font-family: 'Sora', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
.nx-root ::selection { background: rgba(34,211,238,.28); }
.nx-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

.nx-hero-glow { background:
  radial-gradient(55% 45% at 82% 8%, rgba(22,139,255,.30), transparent 70%),
  radial-gradient(45% 40% at 8% 92%, rgba(34,211,238,.12), transparent 70%); }
.nx-grid { background-image: linear-gradient(rgba(56,189,248,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.07) 1px, transparent 1px);
  background-size: 64px 64px; animation: nx-pan 40s linear infinite;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%); mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%); }
.nx-planet { position: absolute; right: -14vw; top: -30vw; width: 46vw; max-width: 720px; aspect-ratio: 1; border-radius: 9999px;
  background: radial-gradient(circle at 25% 75%, rgba(22,139,255,.20), rgba(5,7,13,0) 62%);
  box-shadow: inset 0 0 90px rgba(56,189,248,.13), 0 0 0 1px rgba(56,189,248,.16); }
.nx-ghost { font-weight: 800; line-height: 1; letter-spacing: -.045em; white-space: nowrap; user-select: none;
  color: transparent; -webkit-text-stroke: 1px rgba(56,189,248,.075); }
.nx-hero-title { font-size: clamp(2.9rem, 10.5vw, 8.5rem); line-height: .94; letter-spacing: -.045em; font-weight: 700; }
.nx-hnode { position: absolute; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 9999px; background: #38BDF8;
  box-shadow: 0 0 12px rgba(56,189,248,.9); animation: nx-node 4s ease-in-out infinite; }
.nx-particle { position: absolute; border-radius: 9999px; background: #38BDF8; opacity: 0; animation: nx-rise linear infinite; }

@keyframes nx-pan { to { background-position: 64px 64px; } }
@keyframes nx-rise { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: .7; } 100% { opacity: 0; transform: translateY(-130px); } }
@keyframes nx-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;

export default function Events() {
  const [eventsList, setEventsList] = useState(defaultEvents);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        const data = await getEvents();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => {
            const dateA = parseEventDate(a.date);
            const dateB = parseEventDate(b.date);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB - dateA;
          });
          setEventsList(sorted);
        }
      } catch (err) {
        console.error("Failed to load events from Firestore:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = eventsList.length;
    const completed = eventsList.filter((e) => (e.status || "").toLowerCase() === "completed").length;
    const upcoming = eventsList.filter((e) => {
      const s = (e.status || "").toLowerCase();
      return s === "upcoming" || s === "ongoing";
    }).length;
    const categories = new Set(eventsList.flatMap((e) => e.tags || [])).size;
    return [
      { label: "TOTAL EVENTS", value: total },
      { label: "COMPLETED", value: completed },
      { label: "UPCOMING", value: upcoming },
      { label: "CATEGORIES", value: categories },
    ];
  }, [eventsList]);

  const tagOptions = useMemo(() => {
    const counts = {};
    eventsList.forEach((e) =>
      (e.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      })
    );
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  }, [eventsList]);

  const hasUpcoming = useMemo(() => {
    return eventsList.some((e) => {
      const s = (e.status || "").toLowerCase();
      return s === "upcoming" || s === "ongoing";
    });
  }, [eventsList]);

  const isUpcomingFallback =
    statusFilter === "upcoming" &&
    !query.trim() &&
    tagFilter === "all" &&
    eventsList.length > 0 &&
    !hasUpcoming;

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();

    let result = eventsList.filter((e) => {
      const matchesQuery =
        !q ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        ((e.tags || []).some((t) => t.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === "all" || (e.status || "").toLowerCase() === statusFilter;
      const matchesTag =
        tagFilter === "all" || (e.tags || []).includes(tagFilter);

      return matchesQuery && matchesStatus && matchesTag;
    });

    if (isUpcomingFallback && result.length === 0) {
      result = [eventsList[0]];
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "az") return (a.title || "").localeCompare(b.title || "");

      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [eventsList, query, statusFilter, tagFilter, sortBy, isUpcomingFallback]);

  const featuredEvent = useMemo(() => {
    return (
      eventsList.find((e) => {
        const s = (e.status || "").toLowerCase();
        return s === "upcoming" || s === "ongoing";
      }) || eventsList[0]
    );
  }, [eventsList]);

  const openEvent = useCallback((e) => setActiveEvent(e), []);
  const closeEvent = useCallback(() => setActiveEvent(null), []);

  return (
    <div className="nx-root w-full bg-[#05070D]">
      <style>{CSS}</style>
      <EventHero stats={stats} />
      <FeaturedEvent
        event={featuredEvent}
        featuredIndex={eventsList.indexOf(featuredEvent)}
        totalCount={eventsList.length}
        isRecentFallback={!hasUpcoming}
        onOpen={openEvent}
      />

      <EventExplorer
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        tagOptions={tagOptions}
        resultCount={filteredEvents.length}
        isUpcomingFallback={isUpcomingFallback}
      />

      <section className="bg-[#0A1020] pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <EventGrid
            items={filteredEvents}
            allEvents={eventsList}
            onOpen={openEvent}
          />
        </div>
      </section>

      <EventModal
        event={activeEvent}
        allEvents={eventsList}
        onClose={closeEvent}
      />
    </div>
  );
}
