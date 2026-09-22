"use client";

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

const ABOUT_META = {
  key: "about",
  index: "01",
  label: "ABOUT",
  title: "Engineering Intelligence",
  tagline: "NeurOnyx is the official ACM Student Chapter at AIKTC, bridging computational theory and impactful real-world intelligence.",
  ghost: "MISSION",
  accent: "#22D3EE",
};

const PILLARS = [
  {
    key: "mission",
    title: "Our Mission",
    desc: "To promote critical and creative thinking within individuals who can contribute to AI and ML technically, economically, socially, and environmentally.",
    accent: "#38BDF8",
  },
  {
    key: "vision",
    title: "Our Vision",
    desc: "To empower students to lead the future of AI and ML by exploring their applications and beyond, while creating a collaborative space for continuous technical growth.",
    accent: "#22D3EE",
  },
  {
    key: "values",
    title: "Our Values",
    desc: "Innovation, rigorous engineering, and collaborative experimentation drive everything we do. We believe in making AI accessible, ethical, and transformative.",
    accent: "#168BFF",
  },
];

export function AboutSection() {
  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="nx-root relative isolate overflow-hidden bg-[#05070D] py-24 text-[#F8FAFC] sm:py-32"
      style={{ "--accent": ABOUT_META.accent } as React.CSSProperties}
    >
      <style>{CSS}</style>

      {/* Atmospheric grain */}
      <div aria-hidden className="nx-grain" />

      {/* Section backdrop with radial glow, faint grid, and ghost watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 32% at 8% 18%, rgba(22,139,255,0.16), transparent 70%), radial-gradient(40% 30% at 92% 82%, rgba(34,211,238,0.12), transparent 70%)",
          }}
        />
        <div className="nx-grid-faint absolute inset-0" />
        <span
          className="nx-ghost absolute bottom-8 left-[-2vw] select-none text-[clamp(6rem,18vw,14rem)]"
        >
          {ABOUT_META.ghost}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER (Teams / Events Pattern) ================= */}
        <ScrollReveal variant="fade-up" duration={0.8}>
          <header className="relative mb-14 sm:mb-20">
            <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
              <span aria-hidden className="nx-dot" />
              <span className="text-[#F8FAFC]">{ABOUT_META.index}</span>
              <span aria-hidden className="text-[#1E293B]">/</span>
              <span>{ABOUT_META.label}</span>
              <span aria-hidden className="nx-rule h-px flex-1" />
            </div>

            <h2
              id="about-title"
              className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
            >
              {ABOUT_META.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              {ABOUT_META.tagline}
            </p>
          </header>
        </ScrollReveal>

        {/* ================= PRIMARY CHAPTER CARD (.nx-card) ================= */}
        <ScrollReveal variant="scale-up" delay={0.1} duration={0.85}>
          <div className="mb-12">
            <article
              onMouseMove={spot}
              style={{ "--accent": "#38BDF8" } as React.CSSProperties}
              className="nx-card group relative p-7 sm:p-10 lg:p-12 hover-subtle"
            >
              <Corners />

              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Insignia Avatar / Logo Frame */}
                <div className="flex justify-center lg:col-span-4 lg:justify-start">
                  <div className="relative flex size-36 sm:size-44 items-center justify-center">
                    {/* Outer ambient glow */}
                    <div className="absolute inset-0 rounded-full bg-[#38BDF8]/20 blur-xl transition-all duration-500 group-hover:bg-[#38BDF8]/30" />
                    
                    {/* Conic Ring */}
                    <div
                      className="relative flex size-full items-center justify-center rounded-full p-[3px]"
                      style={{
                        background:
                          "conic-gradient(from 160deg, #38BDF8, rgba(37,99,235,0.3) 35%, rgba(34,211,238,0.8) 60%, rgba(37,99,235,0.3) 85%, #38BDF8)",
                      }}
                    >
                      <div className="flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-[#0A1020] bg-black shadow-inner">
                        <img
                          src="/logo1.jpg"
                          alt="ACM Student Chapter"
                          className="size-full object-cover scale-[1.05] transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Pulsing indicator dot */}
                    <span
                      aria-hidden
                      className="absolute bottom-2 right-2 size-3 rounded-full border-2 border-[#0A1020] bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]"
                    />
                  </div>
                </div>

                {/* Manifest Text */}
                <div className="lg:col-span-8">
                  <h3 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl lg:text-4xl">
                    NeurOnyx{" "}
                    <span className="text-[#38BDF8]">× ACM Chapter</span>
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
                    NeurOnyx proudly operates as an official ACM Student Chapter recognized by the{" "}
                    <span className="font-semibold text-[#F8FAFC]">
                      Association for Computing Machinery
                    </span>
                    , the world&apos;s largest educational and scientific computing society. Through this network, our chapter connects students with cutting-edge AI architectures, specialized hackathons, and collaborative engineering environments.
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
                    We blend foundational theoretical rigor with real-world deployment, cultivating an ecosystem where students build models that solve substantive technological challenges.
                  </p>

                </div>
              </div>
            </article>
          </div>
        </ScrollReveal>

        {/* ================= THREE PILLARS (Mission, Vision, Values) ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PILLARS.map((pillar, idx) => {
            return (
              <ScrollReveal key={pillar.key} variant="fade-up" delay={0.12 * (idx + 1)} duration={0.8}>
                <article
                  onMouseMove={spot}
                  style={{ "--accent": pillar.accent } as React.CSSProperties}
                  className="nx-card group relative flex flex-col justify-between p-6 sm:p-8 hover-subtle h-full"
                >
                  <Corners />

                  <div>
                    {/* Title */}
                    <h4 className="text-xl font-semibold tracking-tight text-[#F8FAFC] transition-colors duration-200 group-hover:text-[#38BDF8]">
                      {pillar.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                      {pillar.desc}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles — matching TeamSection.jsx, EventsSection.jsx, FaqSection.tsx       */
/* -------------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700;800&display=swap');

.nx-root { position: relative; isolation: isolate; overflow-x: clip; background: #05070D; color: #F8FAFC;
  font-family: 'Sora', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
.nx-root ::selection { background: rgba(34,211,238,.28); }
.nx-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

/* ---------- atmosphere ---------- */
.nx-grain { position: absolute; inset: 0; z-index: 40; pointer-events: none; opacity: .055;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.nx-grid-faint { background-image: linear-gradient(rgba(56,189,248,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); }
.nx-ghost { font-weight: 800; line-height: 1; letter-spacing: -.045em; white-space: nowrap; user-select: none;
  color: transparent; -webkit-text-stroke: 1px rgba(56,189,248,.075); }
.nx-dot { display: inline-block; width: 6px; height: 6px; flex: none; border-radius: 9999px; background: var(--accent, #22D3EE);
  box-shadow: 0 0 10px var(--accent, #22D3EE); animation: nx-node 3s ease-in-out infinite; }
.nx-blink { animation: nx-blink 1.1s steps(2, start) infinite; }
.nx-rule { background: linear-gradient(90deg, rgba(56,189,248,.55), rgba(30,41,59,.9) 28%, rgba(30,41,59,.15)); }

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

.nx-arrow { display: inline-block; color: var(--accent); transition: transform .3s; }
.group:hover .nx-arrow { transform: translateX(3px); }

.nx-corner { position: absolute; width: 10px; height: 10px; border: 0 solid var(--accent); opacity: .5; pointer-events: none;
  transition: opacity .4s, transform .5s cubic-bezier(.2,.7,.2,1); }
.nx-corner.tl { top: 12px; left: 12px; border-top-width: 1px; border-left-width: 1px; }
.nx-corner.tr { top: 12px; right: 12px; border-top-width: 1px; border-right-width: 1px; }
.nx-corner.bl { bottom: 12px; left: 12px; border-bottom-width: 1px; border-left-width: 1px; }
.nx-corner.br { bottom: 12px; right: 12px; border-bottom-width: 1px; border-right-width: 1px; }
.group:hover .nx-corner { opacity: 1; }
.group:hover .nx-corner.tl { transform: translate(-3px, -3px); } .group:hover .nx-corner.tr { transform: translate(3px, -3px); }
.group:hover .nx-corner.bl { transform: translate(-3px, 3px); }  .group:hover .nx-corner.br { transform: translate(3px, 3px); }

@keyframes nx-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes nx-blink { to { visibility: hidden; } }

@media (prefers-reduced-motion: reduce) {
  .nx-root *, .nx-root *::before, .nx-root *::after { animation: none !important; transition-duration: .01ms !important; }
  .nx-card:hover { transform: none; }
}
`;