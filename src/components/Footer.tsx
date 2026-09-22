"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cx(...arr: (string | boolean | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

function LinkedinIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const exploreLinks = [
  { index: "01", label: "About Us", href: "/#about" },
  { index: "02", label: "Event Archive", href: "/events" },
  { index: "03", label: "Core Team", href: "/teams" },
];

const connectLinks = [
  { index: "04", label: "FAQ / Intel", href: "/#faq" },
  { index: "05", label: "Contact Desk", href: "/#contact" },
];

const socialLinks = [
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/company/neuronyx-club/",
    icon: LinkedinIcon,
    accent: "#38BDF8",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/neuronyx_aiktc",
    icon: InstagramIcon,
    accent: "#22D3EE",
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/forms")) {
    return null;
  }

  return (
    <footer
      id="footer"
      className="nx-root relative isolate overflow-hidden border-t border-[#1E293B] bg-[#05070D] text-[#F8FAFC]"
    >
      <style>{CSS}</style>

      {/* Atmospheric grain */}
      <div aria-hidden className="nx-grain" />

      {/* Subtle background ambient glow and grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 35% at 50% 100%, rgba(22,139,255,0.12), transparent 70%)",
          }}
        />
        <div className="nx-grid-faint absolute inset-0" />
      </div>

      {/* Main footer container */}
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand & Mission (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-[0.2em] text-[#F8FAFC] transition-opacity hover:opacity-90"
              aria-label="NeurOnyx Home"
            >
              NEUR<span className="text-[#22D3EE]">ONYX</span>
              <span className="ml-3 nx-mono text-xs font-normal text-[#94A3B8]">
                CHAPTER
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-[#94A3B8]">
              Official ACM Student Chapter at Anjuman-I-Islam&apos;s Kalsekar Technical Campus.
              Advancing artificial intelligence, machine learning systems, and collaborative tech.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-[#1E293B] bg-[#0D1526]/80 text-[#94A3B8] transition-all duration-300 hover:border-[#38BDF8] hover:bg-[#0D1526] hover:text-[#38BDF8] hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  >
                    <Icon className="size-4" style={{ color: social.accent }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Matrix (7 cols) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-7 lg:pl-12">
            {/* Explore Column */}
            <div>
              <ul className="space-y-3.5">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-[#94A3B8] transition-colors duration-200 hover:text-[#38BDF8]"
                    >
                      <span className="nx-mono text-[10px] text-[#38BDF8]/60 group-hover:text-[#38BDF8]">
                        {link.index}
                      </span>
                      <span>{link.label}</span>
                      <span aria-hidden className="nx-arrow text-xs">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intel & Connect Column */}
            <div>
              <ul className="space-y-3.5">
                {connectLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-[#94A3B8] transition-colors duration-200 hover:text-[#22D3EE]"
                    >
                      <span className="nx-mono text-[10px] text-[#22D3EE]/60 group-hover:text-[#22D3EE]">
                        {link.index}
                      </span>
                      <span>{link.label}</span>
                      <span aria-hidden className="nx-arrow text-xs">→</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:neuronyx.aiml@aiktc.ac.in"
                    className="group inline-flex items-center gap-2.5 text-sm text-[#94A3B8] transition-colors duration-200 hover:text-[#38BDF8]"
                  >
                    <span className="nx-mono text-[10px] text-[#38BDF8]/60 group-hover:text-[#38BDF8]">
                      06
                    </span>
                    <span>Electronic Mail</span>
                    <span aria-hidden className="nx-arrow text-xs">→</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-14 border-t border-[#1E293B] pt-8">
          <p className="text-center nx-mono text-[10px] tracking-[0.2em] text-[#94A3B8]">
            © {new Date().getFullYear()} NEURONYX · ACM AIKTC · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles — matching TeamSection.jsx, FaqSection.tsx, ContactSection.tsx     */
/* -------------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700;800&display=swap');

.nx-root { position: relative; isolation: isolate; overflow-x: clip; background: #05070D; color: #F8FAFC;
  font-family: 'Sora', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
.nx-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

/* ---------- atmosphere ---------- */
.nx-grain { position: absolute; inset: 0; z-index: 40; pointer-events: none; opacity: .055;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.nx-grid-faint { background-image: linear-gradient(rgba(56,189,248,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent); }
.nx-dot { display: inline-block; width: 6px; height: 6px; flex: none; border-radius: 9999px; background: #22D3EE;
  box-shadow: 0 0 10px #22D3EE; animation: nx-node 3s ease-in-out infinite; }
.nx-arrow { display: inline-block; color: #22D3EE; transition: transform .3s; }
.group:hover .nx-arrow { transform: translateX(3px); }

@keyframes nx-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .nx-root *, .nx-root *::before, .nx-root *::after { animation: none !important; transition-duration: .01ms !important; }
}
`;