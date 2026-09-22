"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faq";
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

const FAQ_META = {
  key: "faq",
  index: "04",
  label: "FAQ",
  title: "Frequently Asked Questions",
  tagline: "Essential insights into NeurOnyx Club operations, student membership, and community participation.",
  ghost: "INTEL",
  accent: "#22D3EE",
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="nx-root relative isolate overflow-hidden bg-[#05070D] py-24 text-[#F8FAFC] sm:py-32"
      style={{ "--accent": FAQ_META.accent } as React.CSSProperties}
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
              "radial-gradient(45% 32% at 92% 16%, rgba(34,211,238,0.12), transparent 70%), radial-gradient(40% 30% at 8% 85%, rgba(22,139,255,0.15), transparent 70%)",
          }}
        />
        <div className="nx-grid-faint absolute inset-0" />
        <span
          className="nx-ghost absolute bottom-8 right-[-2vw] select-none text-[clamp(6rem,18vw,14rem)]"
        >
          {FAQ_META.ghost}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <ScrollReveal variant="fade-up" duration={0.8}>
          <header className="relative mb-14 sm:mb-20">
            <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
              <span aria-hidden className="nx-dot" />
              <span className="text-[#F8FAFC]">{FAQ_META.index}</span>
              <span aria-hidden className="text-[#1E293B]">/</span>
              <span>{FAQ_META.label}</span>
              <span aria-hidden className="nx-rule h-px flex-1" />
            </div>

            <h2
              id="faq-title"
              className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
            >
              {FAQ_META.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              {FAQ_META.tagline}
            </p>
          </header>
        </ScrollReveal>

        {/* ================= TWO-COLUMN GRID: DIRECTORY & CARDS ================= */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Telemetry & Contact Prompt */}
          <ScrollReveal variant="fade-up" delay={0.1} className="space-y-6 lg:col-span-4">
            <div
              onMouseMove={spot}
              style={{ "--accent": "#38BDF8" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-7 hover-subtle"
            >
              <Corners />
              <h3 className="text-xl font-semibold leading-tight text-[#F8FAFC]">
                Still have unanswered queries?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                Our coordination leads and technical mentors are available to help. Reach out directly through the portal.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive .nx-card Accordion Items */}
          <div className="space-y-4 lg:col-span-8">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <ScrollReveal
                  key={faq.question}
                  variant="fade-up"
                  delay={0.05 * index}
                  duration={0.65}
                >
                  <article
                    onMouseMove={spot}
                    onClick={() => toggleFAQ(index)}
                    style={{ "--accent": "#22D3EE" } as React.CSSProperties}
                    className={cx(
                      "nx-card group relative cursor-pointer p-6 transition-all duration-300 sm:p-7 hover-subtle",
                      isOpen && "is-open"
                    )}
                    aria-expanded={isOpen}
                  >
                    <Corners />

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        {/* Question Heading */}
                        <h3 className="text-lg font-semibold tracking-tight text-[#F8FAFC] transition-colors duration-200 group-hover:text-[#38BDF8] sm:text-xl">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Toggle Icon Ring */}
                      <div
                        aria-hidden
                        className={cx(
                          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1E293B] bg-[#05070D]/60 text-[#94A3B8] transition-all duration-300 group-hover:border-[#22D3EE] group-hover:text-[#F8FAFC]",
                          isOpen && "border-[#22D3EE] bg-[#22D3EE]/15 text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                        )}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cx(
                            "size-4 transition-transform duration-300",
                            isOpen && "rotate-180"
                          )}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Smooth AnimatePresence Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 border-t border-[#1E293B] pt-5">
                            <p className="text-sm leading-relaxed text-[#94A3B8] sm:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles — matching TeamSection.jsx exactly                                  */
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
.nx-card.is-open { border-color: color-mix(in srgb, var(--accent) 65%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent), 0 20px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent); }
.nx-card.is-open::after { opacity: 1; transform: none; }

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