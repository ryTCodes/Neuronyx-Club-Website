"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
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

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const CONTACT_META = {
  key: "contact",
  index: "05",
  label: "CONTACT",
  title: "Get In Touch",
  tagline: "Whether you are looking to collaborate on research, participate in hackathons, or engage our student chapter, our desk is open.",
  ghost: "CONNECT",
  accent: "#22D3EE",
};

export default function ContactSection({ isHome = false }: { isHome?: boolean }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData(initialForm);
      window.setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={cx(
        "nx-root relative isolate overflow-hidden bg-[#05070D] py-24 text-[#F8FAFC] sm:py-32",
        !isHome && "pt-32"
      )}
      style={{ "--accent": CONTACT_META.accent } as React.CSSProperties}
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
          {CONTACT_META.ghost}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <ScrollReveal variant="fade-up" duration={0.8}>
          <header className="relative mb-14 sm:mb-20">
            <div className="nx-mono flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#94A3B8] sm:gap-4 sm:text-[11px]">
              <span aria-hidden className="nx-dot" />
              <span className="text-[#F8FAFC]">{CONTACT_META.index}</span>
              <span aria-hidden className="text-[#1E293B]">/</span>
              <span>{CONTACT_META.label}</span>
              <span aria-hidden className="nx-rule h-px flex-1" />
            </div>

            <h2
              id="contact-title"
              className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#F8FAFC] sm:text-5xl lg:text-6xl"
            >
              {CONTACT_META.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              {CONTACT_META.tagline}
            </p>
          </header>
        </ScrollReveal>

        {/* ================= TWO-COLUMN GRID: DIRECTORY & DISPATCH ================= */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Telemetry & Channel Directory (4 cols) */}
          <ScrollReveal variant="fade-up" delay={0.1} className="space-y-6 lg:col-span-4">
            {/* Electronic Mail Card */}
            <div
              onMouseMove={spot}
              style={{ "--accent": "#38BDF8" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-7 hover-subtle"
            >
              <Corners />
              <h3 className="text-base font-semibold leading-tight text-[#F8FAFC]">
                Contact Email
              </h3>

              <a
                href="mailto:neuronyx.aiml@aiktc.ac.in"
                className="mt-2 block text-sm font-medium text-[#38BDF8] transition-colors hover:text-[#F8FAFC] break-all"
              >
                neuronyx.aiml@aiktc.ac.in
              </a>
            </div>

            {/* Campus Station Card */}
            <div
              onMouseMove={spot}
              style={{ "--accent": "#22D3EE" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-7 hover-subtle"
            >
              <Corners />
              <h3 className="text-base font-semibold leading-tight text-[#F8FAFC]">
                Campus Headquarters
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                NeurOnyx | ACM Student Chapter
                <br />
                Anjuman-I-Islam&apos;s Kalsekar Technical Campus
                <br />
                Plot No. 2 & 3, Sector 16, New Panvel, Navi Mumbai – 410206
              </p>
            </div>

            {/* Networks Card */}
            <div
              onMouseMove={spot}
              style={{ "--accent": "#168BFF" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-7 hover-subtle"
            >
              <Corners />
              <h3 className="text-base font-semibold leading-tight text-[#F8FAFC]">
                Digital Presence
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/company/neuronyx-club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-10 items-center justify-center rounded-full border border-[#1E293B] bg-[#05070D] text-[#94A3B8] transition-all duration-200 hover:border-[#38BDF8] hover:text-[#38BDF8] hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                >
                  <LinkedinIcon className="size-4" />
                </a>

                <a
                  href="https://www.instagram.com/neuronyx_aiktc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-10 items-center justify-center rounded-full border border-[#1E293B] bg-[#05070D] text-[#94A3B8] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Dispatch Form Card (8 cols) */}
          <ScrollReveal variant="scale-up" delay={0.15} className="lg:col-span-8">
            <article
              onMouseMove={spot}
              style={{ "--accent": "#22D3EE" } as React.CSSProperties}
              className="nx-card group relative p-6 sm:p-8 hover-subtle"
            >
              <Corners />

              {submitted ? (
                <div className="space-y-4 py-16 text-center animate-in fade-in duration-300">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-[#F8FAFC]">
                    TRANSMISSION CONFIRMED
                  </h3>
                  <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#94A3B8]">
                    Your communication has been dispatched to our chapter operations desk. A representative will connect with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rayyan Tausalkar"
                        className="w-full rounded-xl border border-[#1E293B] bg-[#05070D]/80 px-4 py-3 nx-mono text-xs text-[#F8FAFC] placeholder-[#94A3B8]/35 transition-all duration-300 focus:border-[#22D3EE] focus:bg-[#05070D] focus:outline-none focus:ring-1 focus:ring-[#22D3EE]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rayyan@example.com"
                        className="w-full rounded-xl border border-[#1E293B] bg-[#05070D]/80 px-4 py-3 nx-mono text-xs text-[#F8FAFC] placeholder-[#94A3B8]/35 transition-all duration-300 focus:border-[#22D3EE] focus:bg-[#05070D] focus:outline-none focus:ring-1 focus:ring-[#22D3EE]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Collaboration / Membership / Research"
                      className="w-full rounded-xl border border-[#1E293B] bg-[#05070D]/80 px-4 py-3 nx-mono text-xs text-[#F8FAFC] placeholder-[#94A3B8]/35 transition-all duration-300 focus:border-[#22D3EE] focus:bg-[#05070D] focus:outline-none focus:ring-1 focus:ring-[#22D3EE]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">
                      MESSAGE *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter message text..."
                      className="w-full resize-none rounded-xl border border-[#1E293B] bg-[#05070D]/80 px-4 py-3 nx-mono text-xs text-[#F8FAFC] placeholder-[#94A3B8]/35 transition-all duration-300 focus:border-[#22D3EE] focus:bg-[#05070D] focus:outline-none focus:ring-1 focus:ring-[#22D3EE]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="nx-mono group relative inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#22D3EE]/50 bg-[#22D3EE]/10 px-6 py-3.5 text-xs font-semibold tracking-[0.2em] text-[#22D3EE] transition-all duration-300 hover:border-[#22D3EE] hover:bg-[#22D3EE] hover:text-[#05070D] hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] active:scale-[0.99] disabled:opacity-50"
                    >
                      <span>{loading ? "SUBMITTING..." : "SUBMIT"}</span>
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </form>
              )}
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles — matching TeamSection.jsx and FaqSection.tsx exactly               */
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