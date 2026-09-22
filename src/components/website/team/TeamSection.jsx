"use client";

// ================================
// TEAM DATA — EDIT MEMBERS HERE
// ================================
//
// FILES
//   NO-team/
//   ├─ Team.jsx      ← this file
//   └─ avatar.png    ← default profile image (same folder as this file)
//
// HOW TO EDIT
//   • Change a name / position / photo by editing the ONE line for that person below.
//   • To use a real photo: drop it in the same folder, import it, and swap it in:
//         import rahul from "./rahul.jpg";
//         { id: "president", name: "Rahul S", position: "President", photo: rahul, ... }
//   • Do NOT change `id` or `category` of leadership members (the layout looks them up by id).
//   • Technical / Media / Design / Data: the FIRST person in each list is the team LEAD.
//   • Optional extras per person (shown in the profile panel when a card is clicked):
//         bio: "Short line about them.",
//         links: [{ label: "LinkedIn", href: "https://..." }],
//
// RENDERING
//   • React 18/19 (automatic JSX runtime) + Tailwind CSS v4 (`@import "tailwindcss";` in your CSS).
//   • Everything else (keyframes, grain, grid, fonts) is inside this file. No other dependencies.
//
import { useCallback, useEffect, useRef, useState } from "react";
import { getTeamMembers } from "@/lib/teamService";

const avatar = "/logo.png";

const defaultTeamData = {
  faculty: [
    { id: "hod", name: "HOD Name", position: "HOD CSE(AIML)", photo: avatar, category: "faculty" },
    { id: "faculty-coordinator", name: "Faculty Coordinator Name", position: "Faculty Coordinator, Neuronyx Club", photo: avatar, category: "faculty" },
  ],

  leadership: [
    { id: "president", name: "President Name", position: "President", photo: avatar, category: "leadership" },
    { id: "vice-president", name: "Vice President Name", position: "Vice President", photo: avatar, category: "leadership" },
    { id: "secretary", name: "Secretary Name", position: "Secretary", photo: avatar, category: "leadership" },
    { id: "treasurer", name: "Treasurer Name", position: "Treasurer", photo: avatar, category: "leadership" },
    { id: "jt-treasurer", name: "Jt Treasurer Name", position: "Jt Treasurer", photo: avatar, category: "leadership" },
  ],

  technical: [
    { id: "technical-lead", name: "Technical Lead Name", position: "Technical Lead", photo: avatar, category: "technical" },
    { id: "technical-1", name: "Technical Member 1", position: "Technical Member", photo: avatar, category: "technical" },
    { id: "technical-2", name: "Technical Member 2", position: "Technical Member", photo: avatar, category: "technical" },
    { id: "technical-3", name: "Technical Member 3", position: "Technical Member", photo: avatar, category: "technical" },
    { id: "technical-4", name: "Technical Member 4", position: "Technical Member", photo: avatar, category: "technical" },
  ],

  media: [
    { id: "media-lead", name: "Media Lead Name", position: "Media Lead", photo: avatar, category: "media" },
    { id: "media-1", name: "Media Member 1", position: "Media Member", photo: avatar, category: "media" },
    { id: "media-2", name: "Media Member 2", position: "Media Member", photo: avatar, category: "media" },
    { id: "media-3", name: "Media Member 3", position: "Media Member", photo: avatar, category: "media" },
    { id: "media-4", name: "Media Member 4", position: "Media Member", photo: avatar, category: "media" },
  ],

  design: [
    { id: "design-lead", name: "Design Lead Name", position: "Design Lead", photo: avatar, category: "design" },
    { id: "design-1", name: "Design Member 1", position: "Design Member", photo: avatar, category: "design" },
    { id: "design-2", name: "Design Member 2", position: "Design Member", photo: avatar, category: "design" },
    { id: "design-3", name: "Design Member 3", position: "Design Member", photo: avatar, category: "design" },
    { id: "design-4", name: "Design Member 4", position: "Design Member", photo: avatar, category: "design" },
  ],

  data: [
    { id: "data-lead", name: "Data Lead Name", position: "Data Lead", photo: avatar, category: "data" },
    { id: "data-1", name: "Data Member 1", position: "Data Member", photo: avatar, category: "data" },
    { id: "data-2", name: "Data Member 2", position: "Data Member", photo: avatar, category: "data" },
    { id: "data-3", name: "Data Member 3", position: "Data Member", photo: avatar, category: "data" },
    { id: "data-4", name: "Data Member 4", position: "Data Member", photo: avatar, category: "data" },
  ],
};

function transformFirestoreTeam(members) {
  if (!members || !members.length) return defaultTeamData;

  const result = {
    faculty: [],
    leadership: [],
    technical: [],
    media: [],
    design: [],
    data: [],
  };

  members.forEach((m, idx) => {
    const rawTeam = (m.Team || "").trim().toUpperCase();
    const rawRole = (m.role || "").trim();
    const rawRoleUpper = rawRole.toUpperCase();
    const photo = m.imageUrl && m.imageUrl.trim() ? m.imageUrl.trim() : avatar;

    const links = [];
    if (m.linkedin && typeof m.linkedin === "string" && m.linkedin.trim()) {
      links.push({ label: "LinkedIn", href: m.linkedin.trim() });
    }
    if (m.github && typeof m.github === "string" && m.github.trim()) {
      links.push({ label: "GitHub", href: m.github.trim() });
    }

    // Faculty
    if (rawTeam.includes("HOD") || rawTeam.includes("FACULTY")) {
      const isHod = rawTeam.includes("HOD");
      result.faculty.push({
        id: isHod ? "hod" : `faculty-${m.id || idx}`,
        docId: m.id,
        name: m.name || (isHod ? "HOD Name" : "Faculty Coordinator"),
        position: isHod ? "HOD CSE(AIML)" : "Faculty Coordinator, Neuronyx Club",
        photo,
        category: "faculty",
        bio: m.bio || "",
        links,
      });
      return;
    }

    // Core Committee / Leadership
    if (
      rawTeam === "PRESIDENT" || rawRoleUpper === "PRESIDENT" ||
      rawTeam === "VICE PRESIDENT" || rawRoleUpper === "VICE PRESIDENT" ||
      rawTeam === "SECRETARY" || rawRoleUpper === "SECRETARY" ||
      rawTeam === "TREASURER" || rawRoleUpper === "TREASURER" ||
      rawTeam === "JOINT TREASURER" || rawRoleUpper === "JOINT TREASURER"
    ) {
      let id = m.id;
      let position = rawRole || "Core Committee";

      if (rawTeam === "PRESIDENT" || rawRoleUpper === "PRESIDENT") {
        id = "president";
        position = "President";
      } else if (rawTeam === "VICE PRESIDENT" || rawRoleUpper === "VICE PRESIDENT") {
        id = "vice-president";
        position = "Vice President";
      } else if (rawTeam === "SECRETARY" || rawRoleUpper === "SECRETARY") {
        id = "secretary";
        position = "Secretary";
      } else if (rawTeam === "TREASURER" || rawRoleUpper === "TREASURER") {
        id = "treasurer";
        position = "Treasurer";
      } else if (rawTeam === "JOINT TREASURER" || rawRoleUpper === "JOINT TREASURER") {
        id = "jt-treasurer";
        position = "Jt Treasurer";
      }

      result.leadership.push({
        id,
        docId: m.id,
        name: m.name,
        position,
        photo,
        category: "leadership",
        bio: m.bio || "",
        links,
      });
      return;
    }

    // Sub-teams: TECHNICAL, MEDIA, DESIGN, DATA
    let cat = null;
    let label = "";
    if (rawTeam.includes("TECH")) {
      cat = "technical";
      label = "Technical";
    } else if (rawTeam.includes("MEDIA")) {
      cat = "media";
      label = "Media";
    } else if (rawTeam.includes("DESIGN")) {
      cat = "design";
      label = "Design";
    } else if (rawTeam.includes("DATA")) {
      cat = "data";
      label = "Data";
    }

    if (cat) {
      const isLead = rawRoleUpper.includes("LEAD");
      result[cat].push({
        id: m.id || `${cat}-${idx}`,
        docId: m.id,
        name: m.name,
        position: isLead ? `${label} Lead` : `${label} Member`,
        isLead,
        photo,
        category: cat,
        bio: m.bio || "",
        links,
      });
    }
  });

  // Sort subteams so Lead comes first
  ["technical", "media", "design", "data"].forEach((k) => {
    result[k].sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0));
  });

  return {
    faculty: result.faculty.length > 0 ? result.faculty : defaultTeamData.faculty,
    leadership: result.leadership.length > 0 ? result.leadership : defaultTeamData.leadership,
    technical: result.technical.length > 0 ? result.technical : defaultTeamData.technical,
    media: result.media.length > 0 ? result.media : defaultTeamData.media,
    design: result.design.length > 0 ? result.design : defaultTeamData.design,
    data: result.data.length > 0 ? result.data : defaultTeamData.data,
  };
}

// ================================
// END OF TEAM DATA — nothing below needs editing for roster changes
// ================================

/* -------------------------------------------------------------------------- */
/*  Section + category configuration (copy / accents only — no people here)    */
/* -------------------------------------------------------------------------- */

const CATEGORY = {
  faculty: { label: "FACULTY", accent: "#38BDF8" },
  leadership: { label: "LEADERSHIP", accent: "#168BFF" },
  technical: { label: "TECHNICAL", accent: "#22D3EE" },
  media: { label: "MEDIA", accent: "#38BDF8" },
  design: { label: "DESIGN", accent: "#168BFF" },
  data: { label: "DATA", accent: "#22D3EE" },
};

const LEADERSHIP_META = {
  key: "leadership",
  index: "01",
  label: "LEADERSHIP",
  title: "Leadership",
  tagline: "Direction from the faculty. Momentum from the core committee.",
  ghost: "IMPACT",
  accent: "#168BFF",
};

const TEAM_SECTIONS = [
  {
    key: "technical",
    index: "02",
    label: "TECHNICAL",
    title: "Technical Team",
    tagline: "The builders behind every idea that ships.",
    chip: "> load team.technical",
    motif: "circuit",
    ghost: "TECHNOLOGY",
    accent: "#22D3EE",
  },
  {
    key: "media",
    index: "03",
    label: "MEDIA",
    title: "Media Team",
    tagline: "Storytellers who turn our work into signal.",
    chip: "REC  CH.03  LIVE",
    motif: "signal",
    ghost: "PEOPLE",
    accent: "#38BDF8",
  },
  {
    key: "design",
    index: "04",
    label: "DESIGN",
    title: "Design Team",
    tagline: "Shaping how NEURONYX looks, reads and feels.",
    chip: "8pt grid  ·  12 col  ·  Aa",
    motif: "layout",
    ghost: "IDEAS",
    accent: "#168BFF",
  },
  {
    key: "data",
    index: "05",
    label: "DATA",
    title: "Data Team",
    tagline: "Finding the pattern inside every dataset.",
    chip: "f(x) = Σ wᵢxᵢ + b",
    motif: "network",
    ghost: "INSIGHT",
    accent: "#22D3EE",
  },
];

const cx = (...parts) => parts.filter(Boolean).join(" ");
const pad = (n) => String(n).padStart(2, "0");
const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                      */
/* -------------------------------------------------------------------------- */

// Fires once when the element scrolls into view.
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const observerUnavailable = typeof IntersectionObserver === "undefined";

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (observerUnavailable) {
      const frameId = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(frameId);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [observerUnavailable, seen, threshold]);

  return [ref, seen];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={cx("nx-reveal", seen && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar + card primitives                                                   */
/* -------------------------------------------------------------------------- */

const AVATAR_SIZE = {
  xl: "size-36 sm:size-44",
  lg: "size-32 sm:size-36",
  md: "size-20 sm:size-24",
  sm: "size-14 sm:size-16 lg:size-[4.5rem]",
};

function Avatar({ member, size = "md" }) {
  return (
    <span className={cx("nx-avatar relative inline-block shrink-0", AVATAR_SIZE[size])}>
      <span aria-hidden className="nx-avatar-glow" />
      <span className="nx-avatar-ring">
        <span className="nx-avatar-plate">
          <img
            src={member.photo}
            alt={`${member.name}, ${member.position}`}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="nx-avatar-img h-full w-full object-cover object-top"
          />
        </span>
      </span>
      <span aria-hidden className="nx-avatar-dot" />
    </span>
  );
}

function Corners() {
  return (
    <>
      <i aria-hidden className="nx-corner tl" />
      <i aria-hidden className="nx-corner tr" />
      <i aria-hidden className="nx-corner bl" />
      <i aria-hidden className="nx-corner br" />
    </>
  );
}

function Arrow({ inset }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cx("nx-arrow pointer-events-none absolute size-3.5", inset ? "right-7 top-7" : "right-4 top-4")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

// Per-variant layout classes. Keeps MemberCard itself short and the differences obvious.
const VARIANT = {
  member: {
    root: "items-center gap-4 p-4 sm:p-5",
    avatar: "sm",
    body: "min-w-0 flex-1 pr-5",
    align: "",
    name: "text-base font-medium",
    position: "text-[0.8rem] text-[#94A3B8] group-hover:text-[#F8FAFC]",
  },
  core: {
    root: "items-center gap-4 p-4 sm:p-5 lg:flex-col lg:gap-5 lg:px-5 lg:py-7 lg:text-center",
    avatar: "md",
    body: "min-w-0 flex-1 pr-5 lg:flex-none lg:pr-0",
    align: "lg:justify-center",
    name: "text-lg font-semibold",
    position: "text-sm text-[#94A3B8] group-hover:text-[#F8FAFC]",
  },
  president: {
    root: "flex-col items-center gap-6 px-6 py-10 text-center sm:py-12",
    avatar: "lg",
    body: "min-w-0",
    align: "justify-center",
    name: "text-2xl font-semibold sm:text-[1.75rem]",
    position: "text-xs font-medium uppercase tracking-[0.3em] text-[#38BDF8] group-hover:text-[#F8FAFC]",
    corners: true,
  },
  lead: {
    root: "flex-col items-center gap-5 p-7 text-center sm:flex-row sm:gap-7 sm:text-left lg:flex-col lg:gap-6 lg:px-8 lg:py-10 lg:text-center",
    avatar: "lg",
    body: "min-w-0",
    align: "justify-center sm:justify-start lg:justify-center",
    name: "text-2xl font-semibold",
    position: "text-sm text-[#94A3B8] group-hover:text-[#F8FAFC]",
    corners: true,
  },
  faculty: {
    root: "flex-col items-center gap-6 p-7 text-center sm:flex-row sm:gap-8 sm:p-9 sm:text-left",
    avatar: "xl",
    body: "min-w-0",
    align: "justify-center sm:justify-start",
    name: "text-2xl font-semibold sm:text-[1.7rem]",
    position: "text-sm text-[#94A3B8] group-hover:text-[#F8FAFC]",
    corners: true,
  },
};

function MemberCard({ member, variant = "member", level = "h3", onSelect }) {
  const cat = CATEGORY[member.category] ?? CATEGORY.leadership;
  const v = VARIANT[variant];
  const Heading = level;

  // Cursor-following spotlight (CSS vars only — no re-render).
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <article
      onMouseMove={spot}
      style={{ "--accent": cat.accent }}
      className={cx(
        "nx-card group relative flex h-full w-full",
        variant === "faculty" && "nx-card-faculty",
        variant === "president" && "nx-card-hero",
        v.root
      )}
    >
      {v.corners && <Corners />}
      <Avatar member={member} size={v.avatar} />

      <div className={v.body}>
        <p className={cx("nx-mono flex items-center gap-2 text-[10px] tracking-[0.22em]", v.align)} style={{ color: cat.accent }}>
          <span aria-hidden className="size-1 rounded-full bg-current" />
          {cat.label}
          {variant === "lead" && (
            <span className="border px-1.5 py-px text-[9px]" style={{ borderColor: `${cat.accent}66` }}>
              LEAD
            </span>
          )}
        </p>

        <Heading className={cx("mt-2 break-words leading-tight tracking-tight text-[#F8FAFC]", v.name)}>
          <button
            type="button"
            className="nx-hit"
            aria-haspopup="dialog"
            aria-label={`Open profile: ${member.name}, ${member.position}`}
            onClick={() => onSelect(member)}
          >
            {member.name}
          </button>
        </Heading>

        <p className={cx("mt-1.5 transition-colors duration-300", v.position)}>{member.position}</p>

        {variant === "faculty" && (
          <span aria-hidden className="mt-5 block h-px w-20 bg-[linear-gradient(90deg,var(--accent),transparent)]" />
        )}
      </div>

      <Arrow inset={v.corners} />
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section furniture                                                          */
/* -------------------------------------------------------------------------- */

function SectionBackdrop({ ghost, side = "right", accent }) {
  const fontSize = `clamp(4rem, ${Math.min(18, 120 / ghost.length).toFixed(1)}vw, 15rem)`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(45% 32% at ${side === "right" ? "92%" : "8%"} 16%, ${accent}1F, transparent 70%)`,
        }}
      />
      <div className="nx-grid-faint absolute inset-0" />
      <span
        className={cx("nx-ghost absolute bottom-6", side === "right" ? "right-[-2vw]" : "left-[-2vw]")}
        style={{ fontSize }}
      >
        {ghost}
      </span>
    </div>
  );
}

function SectionHeader({ meta, count }) {
  return (
    <Reveal as="header" className="relative mb-12 sm:mb-16">
      <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
        <span aria-hidden className="nx-dot" />
        <span className="text-[#F8FAFC]">{meta.index}</span>
        <span aria-hidden className="text-[#1E293B]">/</span>
        <span>{meta.label}</span>
        <span aria-hidden className="nx-rule h-px flex-1" />
      </div>

      <h2
        id={`${meta.key}-title`}
        className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
      >
        {meta.title}
      </h2>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-[#94A3B8] sm:text-lg">{meta.tagline}</p>
    </Reveal>
  );
}

function TierLabel({ tier, title, note }) {
  return (
    <Reveal className="flex items-center gap-4">
      <span className="nx-mono border border-[#1E293B] px-2 py-1 text-[10px] tracking-[0.25em] text-[#22D3EE]">TIER {tier}</span>
      <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-[#F8FAFC] sm:text-base">{title}</h3>
      <span aria-hidden className="h-px flex-1 bg-[#1E293B]" />
      <span className="nx-mono hidden text-[10px] tracking-[0.25em] text-[#94A3B8] sm:inline">{note}</span>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

const HERO_NODES = [
  [8, 22], [18, 60], [30, 32], [44, 14], [58, 38], [72, 20],
  [86, 44], [92, 16], [66, 66], [40, 72], [22, 86], [80, 82],
];
const HERO_LINKS = [
  [0, 2], [2, 3], [3, 4], [4, 5], [5, 7], [5, 6], [4, 8],
  [8, 6], [1, 2], [1, 9], [9, 4], [9, 10], [8, 11],
];
// Deterministic (no Math.random) so server and client renders match.
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
        PEOPLE
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

function TeamHero({ stats }) {
  return (
    <section aria-labelledby="team-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <HeroBackdrop />

      <div className={cx(CONTAINER, "relative flex flex-1 flex-col pt-8 sm:pt-10")}>
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F8FAFC]">
            NEUR<span className="text-[#22D3EE]">ONYX</span>
            <span className="ml-3 font-normal text-[#94A3B8]">TEAM</span>
          </p>
          <p className="nx-mono hidden text-[10px] tracking-[0.35em] text-[#38BDF8] sm:block">BUILD · CONNECT · INNOVATE</p>
        </div>

        {/* headline */}
        <div className="flex flex-1 items-center py-16 sm:py-20">
          <div className="w-full max-w-3xl">
            <h1 id="team-title" className="nx-hero-title text-[#F8FAFC]">
              <span className="block whitespace-nowrap">MEET THE</span>
              <span className="block whitespace-nowrap">MINDS</span>
            </h1>

            <div className="mt-8 h-px w-40 bg-[linear-gradient(90deg,#38BDF8,#22D3EE,#2563EB)] sm:w-64" aria-hidden />

            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#94A3B8] sm:text-xl">
              <span className="text-[#F8FAFC]">People behind the ideas.</span> Different minds, one direction — building, connecting and innovating together.
            </p>
          </div>
        </div>

        {/* stats */}
        <div className="pb-10 sm:pb-12">
          <dl className="grid grid-cols-2 border-t border-[#1E293B] sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-b border-[#1E293B]/70 py-5 pr-4 sm:border-b-0">
                <dt className="nx-mono text-[10px] tracking-[0.25em] text-[#94A3B8]">{s.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-[#F8FAFC]">{pad(s.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Leadership: faculty tier + president-centred constellation                 */
/* -------------------------------------------------------------------------- */

// Draws the branching lines between the President and one side group.
// Height = grid row height; each side group is exactly two equal rows, so the
// branches at 25% / 75% always land on the centre of the two cards.
function Connector({ side, className }) {
  const left = side === "left";
  const paths = left
    ? ["M100 50H50", "M50 25V75", "M50 25H0", "M50 75H0"]
    : ["M0 50H50", "M50 25V75", "M50 25H100", "M50 75H100"];
  const edge = left ? "0%" : "100%";
  const nodes = [["50%", "50%"], ["50%", "25%"], ["50%", "75%"], [edge, "25%"], [edge, "75%"]];

  return (
    <div aria-hidden className={cx("relative hidden lg:block", className)}>
      <svg
        className={cx("absolute inset-0 h-full w-full", left ? "nx-draw-l" : "nx-draw-r")}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {paths.map((d) => (
          <path key={d} d={d} stroke="rgba(56,189,248,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {paths.map((d) => (
          <path
            key={`f-${d}`}
            d={d}
            className="nx-flow"
            stroke="#22D3EE"
            strokeOpacity="0.85"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {nodes.map(([x, y], i) => (
        <span key={i} className="nx-cnode" style={{ left: x, top: y }} />
      ))}
    </div>
  );
}

function CoreConstellation({ president, left, right, onSelect }) {
  const [ref, seen] = useInView(0.2);

  const stack = (members, baseDelay) =>
    members.map((m, i) => (
      <Reveal key={m.id} delay={baseDelay + i * 120} className="h-full lg:py-2.5">
        <MemberCard member={m} variant="core" level="h4" onSelect={onSelect} />
      </Reveal>
    ));

  return (
    <div
      ref={ref}
      className={cx(
        "mt-10 grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-5",
        "lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1.15fr)_72px_minmax(0,1fr)] lg:gap-0",
        seen && "is-visible"
      )}
    >
      {/* President — dominant, centred */}
      <div className="relative order-1 flex items-center justify-center py-2 md:col-span-2 lg:order-3 lg:col-span-1 lg:py-4">
        <span aria-hidden className="nx-halo" />
        <span aria-hidden className="nx-orbit hidden lg:block" style={{ width: "132%" }}>
          <span className="nx-orbit-dot" />
        </span>
        <span aria-hidden className="nx-orbit nx-orbit-rev hidden lg:block" style={{ width: "158%" }} />
        {president && (
          <Reveal className="relative w-full">
            <MemberCard member={president} variant="president" level="h4" onSelect={onSelect} />
          </Reveal>
        )}
      </div>

      {/* Below lg: short spine from President to the committee */}
      <div aria-hidden className="order-2 flex justify-center md:col-span-2 lg:hidden">
        <div className="relative h-10 w-px bg-[linear-gradient(180deg,rgba(56,189,248,0.55),rgba(56,189,248,0.05))]">
          <span className="nx-dot absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Right of President: Vice President, Secretary */}
      <div className="order-3 flex flex-col gap-4 md:order-4 lg:order-5 lg:grid lg:grid-rows-2 lg:gap-0">{stack(right, 160)}</div>

      {/* Left of President: Treasurer, Jt Treasurer */}
      <div className="order-4 flex flex-col gap-4 md:order-3 lg:order-1 lg:grid lg:grid-rows-2 lg:gap-0">{stack(left, 80)}</div>

      <Connector side="left" className="lg:order-2" />
      <Connector side="right" className="lg:order-4" />
    </div>
  );
}

function LeadershipSection({ faculty, leadership, onSelect }) {
  const pick = (id) => leadership.find((m) => m.id === id);
  const president = pick("president");
  const left = ["treasurer", "jt-treasurer"].map(pick).filter(Boolean);
  const right = ["vice-president", "secretary"].map(pick).filter(Boolean);
  const meta = LEADERSHIP_META;

  return (
    <section id={meta.key} aria-labelledby={`${meta.key}-title`} className="nx-section relative isolate py-20 sm:py-28" style={{ "--accent": meta.accent }}>
      <SectionBackdrop ghost={meta.ghost} side="right" accent={meta.accent} />

      <div className={cx(CONTAINER, "relative")}>
        <SectionHeader meta={meta} count={`${pad(faculty.length + leadership.length)} MEMBERS`} />

        <TierLabel tier="A" title="Faculty Leadership" note="GUIDANCE · MENTORSHIP" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {faculty.map((m, i) => (
            <Reveal key={m.id} delay={i * 120} className="h-full">
              <MemberCard member={m} variant="faculty" level="h4" onSelect={onSelect} />
            </Reveal>
          ))}
        </div>

        <div aria-hidden className="relative mx-auto my-12 h-20 w-px bg-[linear-gradient(180deg,rgba(56,189,248,0.55),rgba(56,189,248,0.08))] sm:my-14">
          <span className="nx-dot absolute -top-1 left-1/2 -translate-x-1/2" />
          <span className="nx-dot absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>

        <TierLabel tier="B" title="Core Committee" note="DIRECTION · EXECUTION" />
        <CoreConstellation president={president} left={left} right={right} onSelect={onSelect} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Team sections (Technical / Media / Design / Data)                          */
/* -------------------------------------------------------------------------- */

const WAVE = Array.from({ length: 61 }, (_, i) => `${i === 0 ? "M" : "L"}${i * 8} ${(120 + Math.sin(i * 0.55) * Math.sin(i * 0.13 + 1) * 38).toFixed(1)}`).join(" ");
const RULER = Array.from({ length: 37 }, (_, i) => `M${24 + i * 12} 232v${i % 4 === 0 ? 8 : 4}`).join("");
const NET_LAYERS = [3, 5, 4, 2];
const NET_NODES = NET_LAYERS.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: 60 + l * 120, y: 120 + (i - (n - 1) / 2) * 42 })));

const svgProps = { "aria-hidden": "true", focusable: "false", fill: "none", className: "h-auto w-full" };

function CircuitMotif() {
  const trace = ["M0 40H120L150 70H300L330 40H480", "M0 120H90L120 150H210V200H420", "M240 0V60L270 90H400V170H480", "M60 240V190L90 160H150"];
  const nodes = [[120, 40], [300, 70], [90, 120], [210, 200], [400, 90], [150, 160], [420, 200]];
  return (
    <svg viewBox="0 0 480 240" {...svgProps}>
      {trace.map((d) => <path key={d} d={d} stroke="rgba(34,211,238,0.26)" strokeWidth="1" />)}
      <path d={trace[0]} className="nx-flow" stroke="#22D3EE" strokeOpacity="0.8" />
      <path d={trace[2]} className="nx-flow" stroke="#38BDF8" strokeOpacity="0.8" style={{ animationDelay: "-0.8s" }} />
      <rect x="352" y="18" width="64" height="34" rx="3" stroke="rgba(56,189,248,0.3)" />
      <path d="M364 18v-6M376 18v-6M388 18v-6M400 18v-6" stroke="rgba(56,189,248,0.3)" />
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="#05070D" stroke="#22D3EE" strokeOpacity="0.7" />)}
    </svg>
  );
}

function SignalMotif() {
  return (
    <svg viewBox="0 0 480 250" {...svgProps}>
      <g stroke="rgba(56,189,248,0.4)" strokeWidth="1.2">
        <path d="M24 56V24H56M424 24H456V56M456 184V216H424M56 216H24V184" />
      </g>
      <path d="M240 106V134M226 120H254" stroke="rgba(56,189,248,0.3)" />
      <circle cx="240" cy="120" r="16" stroke="rgba(56,189,248,0.2)" />
      <path d={WAVE} stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
      <circle cx="46" cy="42" r="3.5" fill="#EF4444" className="nx-blink" />
      <text x="56" y="45" fontSize="9" letterSpacing="2" fill="rgba(148,163,184,0.8)" fontFamily="ui-monospace, monospace">REC</text>
      <path d={`M24 232H456${RULER}`} stroke="rgba(148,163,184,0.35)" />
      <g className="nx-sweep">
        <path d="M24 212V246" stroke="#22D3EE" />
        <path d="M18 212h12l-6 7z" fill="#22D3EE" />
      </g>
    </svg>
  );
}

function LayoutMotif() {
  return (
    <svg viewBox="0 0 480 240" {...svgProps}>
      <path d="M52 40H38M60 32V18M428 40H442M420 32V18M52 200H38M60 208V222M428 200H442M420 208V222" stroke="rgba(148,163,184,0.5)" />
      <g stroke="rgba(56,189,248,0.3)" strokeDasharray="2 4">
        <path d="M150 28V212M240 28V212M330 28V212M44 120H436M44 160H436" />
      </g>
      <text x="72" y="160" fontSize="100" fontWeight="700" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1" fontFamily="Sora, ui-sans-serif, sans-serif">Aa</text>
      <circle cx="330" cy="120" r="44" stroke="rgba(56,189,248,0.4)" />
      <rect x="150" y="76" width="88" height="88" stroke="rgba(56,189,248,0.3)" />
      <path d="M240 164L286 84L332 164Z" stroke="rgba(37,99,235,0.7)" />
      <rect x="236" y="160" width="8" height="8" fill="#05070D" stroke="#38BDF8" />
      <rect x="326" y="116" width="8" height="8" fill="#05070D" stroke="#38BDF8" />
    </svg>
  );
}

function NetworkMotif() {
  return (
    <svg viewBox="0 0 480 240" {...svgProps}>
      {NET_NODES.slice(0, -1).map((layer, l) =>
        layer.flatMap((a, i) =>
          NET_NODES[l + 1].map((b, j) => (
            <line key={`${l}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(34,211,238,0.16)" strokeWidth="1" />
          ))
        )
      )}
      {NET_NODES.flat().map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="4.5" fill="#05070D" stroke="#22D3EE" strokeOpacity="0.75" className="nx-svgnode" style={{ animationDelay: `${-i * 0.45}s` }} />
      ))}
      <path d="M420 200H470M420 200V150" stroke="rgba(148,163,184,0.35)" />
      {[430, 442, 454, 462].map((x, i) => <circle key={x} cx={x} cy={192 - i * 9 - (i % 2) * 6} r="1.8" fill="#38BDF8" fillOpacity="0.7" />)}
    </svg>
  );
}

const MOTIFS = { circuit: CircuitMotif, signal: SignalMotif, layout: LayoutMotif, network: NetworkMotif };

function TeamSection({ meta, members, flip, onSelect }) {
  if (!members?.length) return null;
  const [lead, ...rest] = members;
  const Motif = MOTIFS[meta.motif];

  return (
    <section id={meta.key} aria-labelledby={`${meta.key}-title`} className="nx-section relative isolate py-20 sm:py-28" style={{ "--accent": meta.accent }}>
      <SectionBackdrop ghost={meta.ghost} side={flip ? "left" : "right"} accent={meta.accent} />

      {Motif && (
        <div aria-hidden className="nx-fade pointer-events-none absolute right-0 top-14 hidden w-[min(460px,40vw)] lg:block">
          <Motif />
        </div>
      )}

      <div className={cx(CONTAINER, "relative")}>
        <SectionHeader meta={meta} count={`${pad(members.length)} MEMBERS`} />

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className={cx("relative h-full lg:col-span-5", flip && "lg:order-2")}>
            <MemberCard member={lead} variant="lead" onSelect={onSelect} />
            {/* link from lead to the rest of the team */}
            <span
              aria-hidden
              className={cx(
                "absolute top-1/2 hidden h-px w-6 lg:block",
                flip
                  ? "-left-6 bg-[linear-gradient(270deg,rgba(56,189,248,0.55),rgba(56,189,248,0.1))]"
                  : "-right-6 bg-[linear-gradient(90deg,rgba(56,189,248,0.55),rgba(56,189,248,0.1))]"
              )}
            />
          </Reveal>

          <div className={cx("grid gap-4 sm:grid-cols-2 lg:col-span-7", flip && "lg:order-1")}>
            {rest.map((m, i) => (
              <Reveal key={m.id} delay={i * 90} className="h-full">
                <MemberCard member={m} variant="member" onSelect={onSelect} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Profile panel (opens when a card is clicked)                               */
/* -------------------------------------------------------------------------- */

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

const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
);

const IconGlobe = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

function getSocialInfo(labelOrUrl) {
  const s = String(labelOrUrl || "").toLowerCase();
  if (s.includes("linkedin")) return { name: "LinkedIn", icon: IconLinkedIn };
  if (s.includes("github")) return { name: "GitHub", icon: IconGitHub };
  if (s.includes("instagram")) return { name: "Instagram", icon: IconInstagram };
  return { name: "Website", icon: IconGlobe };
}

function ProfilePanel({ member, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const cat = CATEGORY[member.category] ?? CATEGORY.leadership;

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div className="nx-backdrop absolute inset-0 bg-[#05070D]/80 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-name"
        className="nx-panel nx-pop group relative max-h-[92svh] w-full max-w-md overflow-y-auto"
        style={{ "--accent": cat.accent }}
      >
        <Corners />
        <div className="flex items-center justify-between px-6 pt-6">
          <p className="nx-mono flex items-center gap-2 text-[10px] tracking-[0.25em]" style={{ color: cat.accent }}>
            <span aria-hidden className="nx-dot" />
            {cat.label}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="grid size-9 place-items-center rounded-full border border-[#1E293B] text-[#94A3B8] transition-colors hover:border-[#22D3EE] hover:text-[#F8FAFC]"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pb-8 pt-4 text-center">
          <Avatar member={member} size="xl" />
          <h2 id="profile-name" className="mt-7 text-2xl font-semibold tracking-tight text-[#F8FAFC]">{member.name}</h2>
          <p className="mt-1.5 text-sm text-[#94A3B8]">{member.position}</p>

          {member.bio && <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#94A3B8]">{member.bio}</p>}

          <div className="nx-mono mt-6 flex w-full items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A1020] px-4 py-3 text-[10px] tracking-[0.2em]">
            <span className="text-[#94A3B8]">TEAM / SQUAD</span>
            <span className="font-semibold text-[#F8FAFC]">{cat.label}</span>
          </div>

          {member.links?.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {member.links.map((l, idx) => {
                const info = getSocialInfo(l.label || l.href);
                const Icon = info.icon;
                return (
                  <a
                    key={l.label + idx}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={info.name}
                    title={info.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1E293B] bg-[#0A1020] text-[#94A3B8] transition-all duration-200 hover:scale-110 hover:border-[#22D3EE] hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/* -------------------------------------------------------------------------- */

function TeamFooter() {
  return (
    <footer className={cx(CONTAINER, "relative flex items-center gap-5 pb-10 pt-4")}>
      <p className="nx-mono text-[11px] tracking-[0.4em] text-[#94A3B8]">NEURONYX</p>
      <span aria-hidden className="h-px flex-1 bg-[linear-gradient(90deg,rgba(37,99,235,0.6),rgba(30,41,59,0.4))]" />
      <p className="nx-mono hidden text-[10px] tracking-[0.3em] text-[#38BDF8] sm:block">MORE MINDS. A BRIGHTER TOMORROW.</p>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Team() {
  const [selected, setSelected] = useState(null);
  const [teamData, setTeamData] = useState(defaultTeamData);
  const [loading, setLoading] = useState(true);
  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      try {
        const data = await getTeamMembers();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTeamData(transformFirestoreTeam(data));
        }
      } catch (err) {
        console.error("Failed to load team members from Firestore:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = Object.values(teamData).flat().length;
  const stats = [
    { label: "FACULTY", value: teamData.faculty.length },
    { label: "CORE COMMITTEE", value: teamData.leadership.length },
    { label: "TEAMS", value: TEAM_SECTIONS.length },
    { label: "MINDS IN TOTAL", value: total },
  ];

  return (
    <div className="nx-root">
      <style>{CSS}</style>
      <div aria-hidden className="nx-grain" />

      <TeamHero stats={stats} />
      <LeadershipSection faculty={teamData.faculty} leadership={teamData.leadership} onSelect={setSelected} />
      {TEAM_SECTIONS.map((meta, i) => (
        <TeamSection key={meta.key} meta={meta} members={teamData[meta.key]} flip={i % 2 === 1} onSelect={setSelected} />
      ))}
      <TeamFooter />

      {selected && <ProfilePanel member={selected} onClose={close} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles — keyframes and effects Tailwind utilities can't express             */
/*  (Fonts load from Google Fonts; delete the @import line to use system fonts) */
/* -------------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700;800&display=swap');

@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }

.nx-root { position: relative; isolation: isolate; overflow-x: clip; background: #05070D; color: #F8FAFC;
  font-family: 'Sora', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
.nx-root ::selection { background: rgba(34,211,238,.28); }
.nx-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.nx-root a:focus-visible, .nx-root button:focus-visible { outline: 2px solid #22D3EE; outline-offset: 3px; border-radius: 6px; }

/* ---------- atmosphere ---------- */
.nx-grain { position: absolute; inset: 0; z-index: 40; pointer-events: none; opacity: .055;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.nx-hero-glow { background:
  radial-gradient(55% 45% at 82% 8%, rgba(22,139,255,.30), transparent 70%),
  radial-gradient(45% 40% at 8% 92%, rgba(34,211,238,.12), transparent 70%); }
.nx-grid { background-image: linear-gradient(rgba(56,189,248,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.07) 1px, transparent 1px);
  background-size: 64px 64px; animation: nx-pan 40s linear infinite;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%); mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%); }
.nx-grid-faint { background-image: linear-gradient(rgba(56,189,248,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); }
.nx-planet { position: absolute; right: -14vw; top: -30vw; width: 46vw; max-width: 720px; aspect-ratio: 1; border-radius: 9999px;
  background: radial-gradient(circle at 25% 75%, rgba(22,139,255,.20), rgba(5,7,13,0) 62%);
  box-shadow: inset 0 0 90px rgba(56,189,248,.13), 0 0 0 1px rgba(56,189,248,.16); }
.nx-ghost { font-weight: 800; line-height: 1; letter-spacing: -.045em; white-space: nowrap; user-select: none;
  color: transparent; -webkit-text-stroke: 1px rgba(56,189,248,.075); }
.nx-hero-title { font-size: clamp(2.9rem, 10.5vw, 8.5rem); line-height: .94; letter-spacing: -.045em; font-weight: 700; }
.nx-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(248,250,252,.85); }
.nx-navlink { transition: color .3s; } .nx-navlink:hover { color: #F8FAFC; }

.nx-hnode { position: absolute; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 9999px; background: #38BDF8;
  box-shadow: 0 0 12px rgba(56,189,248,.9); animation: nx-node 4s ease-in-out infinite; }
.nx-particle { position: absolute; border-radius: 9999px; background: #38BDF8; opacity: 0; animation: nx-rise linear infinite; }
.nx-dot { display: inline-block; width: 6px; height: 6px; flex: none; border-radius: 9999px; background: var(--accent, #22D3EE);
  box-shadow: 0 0 10px var(--accent, #22D3EE); animation: nx-node 3s ease-in-out infinite; }
.nx-blink { animation: nx-blink 1.1s steps(2, start) infinite; }
.nx-theme { color: #94A3B8; animation: nx-theme 8s infinite; }
.nx-fade { -webkit-mask-image: linear-gradient(to left, #000 45%, transparent); mask-image: linear-gradient(to left, #000 45%, transparent); }
.nx-flow { stroke-dasharray: 3 9; animation: nx-flow 1.6s linear infinite; }
.nx-svgnode { animation: nx-node 3.2s ease-in-out infinite; }
.nx-sweep { animation: nx-sweep 7s linear infinite; }

/* ---------- reveals ---------- */
.nx-reveal { opacity: 0; transform: translateY(22px); transition: opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); }
.nx-reveal.is-visible { opacity: 1; transform: none; }
.nx-rule { background: linear-gradient(90deg, rgba(56,189,248,.55), rgba(30,41,59,.9) 28%, rgba(30,41,59,.15)); transform: scaleX(0); transform-origin: left;
  transition: transform 1.3s cubic-bezier(.2,.7,.2,1) .25s; }
.is-visible .nx-rule { transform: scaleX(1); }

/* ---------- cards ---------- */
.nx-card { isolation: isolate; border: 1px solid rgba(30,41,59,.95); border-radius: 18px;
  background: linear-gradient(180deg, rgba(13,21,38,.94), rgba(10,16,32,.94));
  transition: transform .45s cubic-bezier(.2,.7,.2,1), border-color .35s, box-shadow .35s; }
.nx-card::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .35s;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%); }
.nx-card::after { content: ""; position: absolute; left: 14%; right: 14%; top: -1px; height: 1px; pointer-events: none; opacity: 0; transform: scaleX(.25);
  background: linear-gradient(90deg, transparent, var(--accent), transparent); transition: transform .55s cubic-bezier(.2,.7,.2,1), opacity .4s; }
.nx-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 16%, transparent), 0 20px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent); }
.nx-card:hover::before { opacity: 1; } .nx-card:hover::after { opacity: 1; transform: none; }
.nx-card:has(:focus-visible) { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent) 65%, transparent);
  box-shadow: 0 20px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent); outline: 2px solid #22D3EE; outline-offset: 3px; }
.nx-card:has(:focus-visible)::before { opacity: 1; } .nx-card:has(:focus-visible)::after { opacity: 1; transform: none; }

.nx-card-hero { border-color: rgba(56,189,248,.34);
  background: radial-gradient(120% 70% at 50% 0%, rgba(22,139,255,.24), transparent 62%), linear-gradient(180deg, #0D1526, #0A1020);
  box-shadow: inset 0 1px 0 rgba(248,250,252,.05), 0 0 60px -24px rgba(22,139,255,.6); }
.nx-card-faculty { border-radius: 22px;
  background: repeating-linear-gradient(135deg, rgba(56,189,248,.035) 0 1px, transparent 1px 11px), linear-gradient(180deg, rgba(13,21,38,.96), rgba(10,16,32,.96)); }
.nx-card-faculty::after { opacity: .9; transform: none; left: 8%; right: 8%; }

.nx-hit { display: inline; padding: 0; border: 0; background: none; color: inherit; font: inherit; letter-spacing: inherit; text-align: inherit; cursor: pointer; }
.nx-hit::after { content: ""; position: absolute; inset: 0; }
.nx-arrow { color: var(--accent); opacity: 0; transform: translate(-4px, 4px); transition: opacity .3s, transform .4s cubic-bezier(.2,.7,.2,1); }
.group:hover .nx-arrow, .nx-card:has(:focus-visible) .nx-arrow { opacity: 1; transform: none; }

.nx-corner { position: absolute; width: 10px; height: 10px; border: 0 solid var(--accent); opacity: .5; pointer-events: none;
  transition: opacity .4s, transform .5s cubic-bezier(.2,.7,.2,1); }
.nx-corner.tl { top: 12px; left: 12px; border-top-width: 1px; border-left-width: 1px; }
.nx-corner.tr { top: 12px; right: 12px; border-top-width: 1px; border-right-width: 1px; }
.nx-corner.bl { bottom: 12px; left: 12px; border-bottom-width: 1px; border-left-width: 1px; }
.nx-corner.br { bottom: 12px; right: 12px; border-bottom-width: 1px; border-right-width: 1px; }
.group:hover .nx-corner { opacity: 1; }
.group:hover .nx-corner.tl { transform: translate(-3px, -3px); } .group:hover .nx-corner.tr { transform: translate(3px, -3px); }
.group:hover .nx-corner.bl { transform: translate(-3px, 3px); }  .group:hover .nx-corner.br { transform: translate(3px, 3px); }

/* ---------- avatar ---------- */
.nx-avatar-glow { position: absolute; inset: -16%; border-radius: 9999px; opacity: .5; pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 66%); transition: opacity .5s, transform .6s cubic-bezier(.2,.7,.2,1); }
.group:hover .nx-avatar-glow { opacity: 1; transform: scale(1.1); }
.nx-avatar-ring { position: absolute; inset: 0; display: block; padding: 2px; border-radius: 9999px;
  background: conic-gradient(from 160deg, var(--accent), rgba(37,99,235,.2) 35%, rgba(34,211,238,.8) 60%, rgba(37,99,235,.2) 85%, var(--accent)); }
/* avatar.png is an opaque image on white, so the plate matches it (Ice White) — swap for your own photos freely */
.nx-avatar-plate { position: relative; display: block; height: 100%; width: 100%; overflow: hidden; border-radius: 9999px; border: 3px solid #0A1020; background: #FEFEFE; }
.nx-avatar-plate::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: opacity .5s;
  background: linear-gradient(160deg, rgba(56,189,248,.24), rgba(56,189,248,0) 45%, rgba(37,99,235,.30)); box-shadow: inset 0 0 18px rgba(5,7,13,.35); }
.group:hover .nx-avatar-plate::after { opacity: .55; }
.nx-avatar-img { transition: transform .8s cubic-bezier(.2,.7,.2,1); }
.group:hover .nx-avatar-img { transform: scale(1.09); }
.nx-avatar-dot { position: absolute; right: 7%; bottom: 7%; width: 10px; height: 10px; border-radius: 9999px; background: #22D3EE; border: 2px solid #0A1020;
  box-shadow: 0 0 10px rgba(34,211,238,.8); animation: nx-node 3s ease-in-out infinite; }

/* ---------- President constellation ---------- */
.nx-halo { position: absolute; left: 50%; top: 50%; width: 150%; max-width: 640px; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 9999px; pointer-events: none;
  background: radial-gradient(closest-side, rgba(22,139,255,.22), rgba(34,211,238,.06) 55%, transparent); animation: nx-breathe 7s ease-in-out infinite; }
.nx-orbit { position: absolute; left: 50%; top: 50%; aspect-ratio: 1; border-radius: 9999px; border: 1px dashed rgba(56,189,248,.16); pointer-events: none;
  transform: translate(-50%, -50%); animation: nx-spin 90s linear infinite; }
.nx-orbit-rev { border-style: solid; border-color: rgba(56,189,248,.07); animation-direction: reverse; animation-duration: 140s; }
.nx-orbit-dot { position: absolute; top: -3px; left: 50%; width: 6px; height: 6px; margin-left: -3px; border-radius: 9999px; background: #22D3EE; box-shadow: 0 0 12px #22D3EE; }
.nx-draw-l { clip-path: inset(-6px -6px -6px 101%); transition: clip-path 1.5s cubic-bezier(.4,0,.2,1) .35s; }
.nx-draw-r { clip-path: inset(-6px 101% -6px -6px); transition: clip-path 1.5s cubic-bezier(.4,0,.2,1) .35s; }
.is-visible .nx-draw-l, .is-visible .nx-draw-r { clip-path: inset(-6px); }
.nx-cnode { position: absolute; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 9999px; background: #22D3EE; box-shadow: 0 0 10px rgba(34,211,238,.8);
  opacity: 0; transition: opacity .7s ease 1.3s; }
.is-visible .nx-cnode { opacity: 1; }

/* ---------- profile panel ---------- */
.nx-panel { border: 1px solid rgba(56,189,248,.3); border-radius: 26px;
  background: radial-gradient(120% 60% at 50% 0%, rgba(22,139,255,.22), transparent 65%), linear-gradient(180deg, #0D1526, #0A1020);
  box-shadow: 0 30px 90px -20px rgba(22,139,255,.45); }
.nx-backdrop { animation: nx-fadein .3s ease both; }
.nx-pop { animation: nx-pop .45s cubic-bezier(.2,.7,.2,1) both; }

/* ---------- keyframes ---------- */
@keyframes nx-pan { to { background-position: 64px 64px; } }
@keyframes nx-rise { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: .7; } 100% { opacity: 0; transform: translateY(-130px); } }
@keyframes nx-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes nx-breathe { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
@keyframes nx-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes nx-flow { to { stroke-dashoffset: -24; } }
@keyframes nx-sweep { from { transform: translateX(0); } to { transform: translateX(432px); } }
@keyframes nx-blink { to { visibility: hidden; } }
@keyframes nx-theme { 0% { color: #94A3B8; } 6%, 22% { color: #F8FAFC; } 30%, 100% { color: #94A3B8; } }
@keyframes nx-fadein { from { opacity: 0; } to { opacity: 1; } }
@keyframes nx-pop { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .nx-root *, .nx-root *::before, .nx-root *::after { animation: none !important; transition-duration: .01ms !important; transition-delay: 0s !important; }
  .nx-reveal { opacity: 1 !important; transform: none !important; }
  .nx-rule { transform: none !important; }
  .nx-draw-l, .nx-draw-r { clip-path: inset(-6px) !important; }
  .nx-cnode { opacity: 1 !important; }
  .nx-particle { opacity: .35; }
  .nx-card:hover, .nx-card:has(:focus-visible) { transform: none; }
}
`;
