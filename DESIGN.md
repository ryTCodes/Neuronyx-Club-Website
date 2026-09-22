# NeurOnyx Design System — Events & Teams

> **Scope Notice:** This document defines the design language, token system, component architectures, and visual patterns extracted strictly from the **Events Section** (`src/components/website/events/EventsSection.jsx`) and the **Teams Section** (`src/components/website/team/TeamSection.jsx`).

---

## 1. Visual Philosophy & Core Identity

The interface represents a **futuristic digital archive and mission control** for an advanced student computing chapter. Rather than a generic marketing layout, the experience is framed as a high-density, cyberpunk-editorial command center inspired by neural topologies, aerospace telemetry, and sci-fi terminals.

### Core Visual Tenets
- **Deep Space Substrates (`#05070D`, `#0A1020`):** Near-black dominant backgrounds prevent visual noise, creating contrast for glowing electric hues.
- **Layered Atmosphere:** Depth is established via subtle fractal SVG grain (`.nx-grain`), infinite panning coordinate grids (`.nx-grid`), diffuse radial halos (`.nx-hero-glow`), and oversized ghost typographic watermarks (`.nx-ghost`).
- **Cybernetic Framing:** Cards feature glowing edge-beams, interactive mouse-following spotlights, and precision technical corner brackets (`.nx-corner`).
- **Code & Telemetry Typographic Contrast:** Technical metadata is styled with monospaced terminal aesthetic (`JetBrains Mono`), juxtaposed against geometric sans display headings (`Sora`).
- **Zero Generic Assets:** Visual motifs are dynamically synthesized with inline SVG geometries, radial glows, and CSS matrices instead of stock imagery.

---

## 2. Color Palette & Token System

### 2.1 Brand & Accent Hues

| Token | Hex | Role & Usage |
|---|---|---|
| `Electric Blue` | `#168BFF` | Core brand identity, leadership accents, primary CTA glows, orbital halos |
| `Neural Cyan` | `#22D3EE` | Secondary interactive accent, active status dots, technical & data badges |
| `Neon Azure` | `#38BDF8` | Primary interactive links, faculty & media highlights, border glows, cursor rings |
| `Royal Blue` | `#2563EB` | Deep gradient stop, conic ring shadow depth, modal boundary glow |

### 2.2 Category & Team Specific Accents

| Category | Accent Hex | Role | Visual Motif / Identifier |
|---|---|---|---|
| **Faculty** | `#38BDF8` | Institutional coordination & advisory | Technical grid plate, double top-rule |
| **Leadership** | `#168BFF` | Executive direction & momentum | Planetary orbit, constellation nodes, breathing halo |
| **Technical** | `#22D3EE` | Architecture, software & infrastructure | Circuit traces, logic flow, `> load team.technical` |
| **Media** | `#38BDF8` | Storytelling, broadcasting & documentation | Signal sweep, waveform, `REC CH.03 LIVE` |
| **Design** | `#168BFF` | Brand identity, interfaces & aesthetics | Coordinate layout, `8pt grid · 12 col · Aa` |
| **Data** | `#22D3EE` | Machine learning, analytics & algorithms | Neural network graph, `f(x) = Σ wᵢxᵢ + b` |

### 2.3 Neutrals & Background Surfaces

| Token | Hex / Value | Purpose |
|---|---|---|
| `Deep Space` | `#05070D` | Master page background, base viewport layer |
| `Midnight Navy` | `#0A1020` | Secondary surface, grid section background, avatar inner plate border |
| `Navy Glass` | `#0D1526` | Card background base, modal container surface |
| `Border Slate` | `rgba(30, 41, 59, 0.95)` | Baseline card structural border |
| `Muted Slate` | `#94A3B8` | Body copy, secondary metadata, terminal labels |
| `Ice White` | `#F8FAFC` | Headings, primary text, high-contrast labels |
| `Success Green`| `#10B981` | "Completed" status pill indicator, live operational state |

### 2.4 Gradients

- **Brand Hero Gradient:** `linear-gradient(90deg, #38BDF8, #22D3EE, #2563EB)`
- **Surface Elevation Gradient:** `linear-gradient(180deg, rgba(13,21,38,0.94), rgba(10,16,32,0.94))`
- **Card Edge Beam:** `linear-gradient(90deg, transparent, var(--accent), transparent)`
- **Section Divider Rule:** `linear-gradient(90deg, rgba(56,189,248,0.55), rgba(30,41,59,0.9) 28%, rgba(30,41,59,0.15))`
- **Avatar Conic Ring:** `conic-gradient(from 160deg, var(--accent), rgba(37,99,235,0.2) 35%, rgba(34,211,238,0.8) 60%, rgba(37,99,235,0.2) 85%, var(--accent))`

---

## 3. Typography & Hierarchy

### 3.1 Font Families
- **Display & Headings:** `'Sora', ui-sans-serif, system-ui, sans-serif`
- **Monospace, Chips & Code Telemetry:** `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- **Body & Captions:** `'Sora'` / `'Inter', sans-serif`

### 3.2 Typographic Hierarchy Scale

| Role | Font Family | Size | Weight | Tracking | Details |
|---|---|---|---|---|---|
| **Super Hero Title** | Sora | `clamp(2.9rem, 10.5vw, 8.5rem)` | 700 | `-0.045em` | `leading: 0.94`, Ice White with Stroked Outline variant |
| **Section Headings** | Sora | `clamp(1.8rem, 4vw, 3rem)` | 700 | `-0.02em` | Tight leading, accented by eyebrow chip |
| **Watermark Ghost** | Sora | `clamp(4rem, 14vw, 11rem)` | 800 | `-0.045em` | `-webkit-text-stroke: 1px rgba(56,189,248,0.075)`, transparent fill |
| **Card Member Title**| Sora | `1.15rem – 1.35rem` | 600–700 | Normal | Crisp text, hover glow transition |
| **Category Eyebrow** | JetBrains Mono | `0.72rem – 0.8rem` | 500 | `0.25em` | Uppercase, bracketed or paired with pulsing accent dot |
| **Telemetry Chip** | JetBrains Mono | `0.72rem – 0.78rem` | 400–500 | `0.1em` | Glass badge, borders `rgba(56,189,248,0.18)` |
| **Body / Bio Copy** | Sora | `0.88rem – 0.95rem` | 400 | Normal | `text-slate-400` / `leading-relaxed` |
| **Event Date Numerals**| JetBrains Mono | `1.5rem – 1.8rem` | 700 | Normal | Monospaced date block in event card corner |

---

## 4. Atmospheric & Structural Layers

Both Events and Teams utilize a multi-layer atmospheric stack behind content:

1. **Fractal Noise Texture (`.nx-grain`):**
   - High-frequency SVG turbulence overlay (`feTurbulence baseFrequency="0.85"`)
   - Placed at `opacity: 0.055`, fixed over entire viewport, non-interactive (`pointer-events: none`).
2. **Infinite Panning Grid (`.nx-grid` & `.nx-grid-faint`):**
   - Dual linear gradients creating 64px × 64px square cells.
   - Panned continuously via `@keyframes nx-pan` (`64px 64px` delta over 40s).
   - Elliptical alpha mask (`radial-gradient(ellipse 80% 70% at 50% 45%, #000 25%, transparent 78%)`) soft-fading edges.
3. **Deep Radial Glows (`.nx-hero-glow`):**
   - Dual corner orbs: `Electric Blue (30%)` at top-right (82% 8%), `Neural Cyan (12%)` at bottom-left (8% 92%).
4. **Orbital Celestial Planet (`.nx-planet`):**
   - Massive geometric disc (`46vw`, max `720px`) at top-right edge with `radial-gradient` glow and `box-shadow` depth rim.
5. **Ghost Typographic Stroking (`.nx-ghost`):**
   - Large transparent characters with `1px rgba(56,189,248,0.075)` outline placed along department cards as watermark accents.

---

## 5. Teams Section Design Specification

### 5.1 Architecture & Layout
- **Team Hero (`<TeamHero />`):**
  - Live member counter badge with pulsing cyan status dot.
  - Giant split headline: Solid Ice White text + Transparent stroked wireframe text (`.nx-outline`).
  - Constellation network backdrop (`<HeroBackdrop />`) with animated SVG links and glowing coordinate nodes.
  - Interactive department quick-jump filter bar.
- **Leadership Section (`<LeadershipSection />`):**
  - **Faculty Tier:** Framed by diagonal hatched glass pattern (`.nx-card-faculty`), double edge highlights, and high-prestige badges.
  - **President Hero Card:** Centerpiece featuring dual counter-rotating celestial orbits (`.nx-orbit`, `.nx-orbit-rev`), breathing background halo (`.nx-halo`), and animated SVG drawing vector brackets (`.nx-draw-l`, `.nx-draw-r`).
  - **Core Officers Grid:** Balanced grid of leadership members with role hierarchy.
- **Department Sections (`<TeamSection />`):**
  - Alternating staggered layout (`flip={i % 2 === 1}`) with left/right visual balancing.
  - Left column: Department index, label, title, tagline, telemetry chip, and ambient ghost watermark.
  - Right column: Department Lead card (full featured) followed by department members grid.
- **Profile Detail Modal (`<ProfilePanel />`):**
  - Floating focus drawer (`.nx-panel`) with radial glow backdrop, high-res avatar, member bio, category pill, and external links.

### 5.2 The Interactive Team Card (`.nx-card`)
- **Base Style:** Rounded `18px`, `border: 1px solid rgba(30,41,59,0.95)`, gradient fill `#0D1526` to `#0A1020`.
- **Spotlight Hover (`.nx-card::before`):** Dynamic radial spotlight tracking mouse coordinates (`--mx`, `--my`) in real-time.
- **Glowing Beam (`.nx-card::after`):** Top border neon beam scaling from 25% to 100% on hover.
- **Cybernetic Corners (`.nx-corner`):** Four 10px corner brackets at TL, TR, BL, BR that separate outward by 3px on hover.
- **Avatar Presentation:**
  - Double circular borders with rotating conic gradient ring (`.nx-avatar-ring`).
  - Inner avatar plate with vignette inset shadow and 1.09x image scale zoom on hover.
  - Bottom-right glowing status dot (`.nx-avatar-dot`).

---

## 6. Events Section Design Specification

### 6.1 Architecture & Layout
- **Event Hero (`<EventHero />`):**
  - Terminal breadcrumb eyebrow: `"NEURONYX ARCHIVE // 2025 — 2026"`.
  - Massive title: `"Experiences that define our journey."`
  - Live status indicator: Pulsing green beacon (`#10B981`) with `"ONLINE · ALL EXPERIENCES"`.
  - Visual generative sphere (`<HeroVisual />`) with rotating particle orbit and coordinate reticles.
- **Telemetry Counter (`<EventStats />`):**
  - 4-column metric matrix (Total Events, Active Members, Workshops, Hackathons) with hairline separators and cyan stat values.
- **Featured Experience Card (`<FeaturedEvent />`):**
  - Full-bleed panoramic hero card with synthetic visual backdrop (`<VisualFrame />`).
  - Event metadata stack: Date badge, duration, venue pin, and interactive modal trigger CTA.
- **Command Center & Filter Bar (`<EventExplorer />`):**
  - Live search input with glass surface and cyan focus glow.
  - Status filter pill buttons (`ALL`, `COMPLETED`, `UPCOMING`).
  - Horizontal scrolling tag chips with active accent states and item counts.
  - Sort selection dropdown (`Newest First`, `Oldest First`, `Title A–Z`).
- **Event Grid & Cards (`<EventGrid />`, `<EventCard />`):**
  - Responsive 1 / 2 / 3 column card grid.
  - Card anatomy:
    1. Generative Visual Header with custom event motif.
    2. Date stamp badge with numeric day and abbreviated month.
    3. Status pill (`Completed` with green dot).
    4. Headline title with hover color transition to Neural Cyan.
    5. Clamped 3-line description with high legibility.
    6. Tag list chips + arrow CTA button.
- **Event Detail Dialog (`<EventModal />`):**
  - Glassmorphic modal overlay (`backdrop-blur-md`).
  - Visual header banner, metadata badge grid (Date, Duration, Location, Category), comprehensive event overview, tags, and action buttons.

### 6.2 Generative Event Visual Motifs (`MOTIF_MAP`)
Events do not rely on static thumbnail image uploads. Every event visual is procedurally rendered using Tailwind + SVG driven by brand accents:
1. `BrandMotif` (Inauguration): Concentric rotating radar rings and cardinal axis ticks.
2. `CelebrationMotif` (Teacher's Day): Expanding radial bursts and dual harmonic circles.
3. `InnovationMotif` (Engineer's Day): Concentric technical gears and coordinate calipers.
4. `BattleMotif` (Build vs Break): Opposing dynamic chevron arrays and high-voltage grid lines.
5. `JavaMotif` (Java Bootcamp): Stacked byte memory blocks and nested execution rings.
6. `GitMotif` (Git/GitHub): Git commit tree nodes, merge branch bezier curves.
7. `DockerMotif` (Docker Session): Modular container matrices and shipping grid overlays.
8. `MLMotif` (Machine Learning): Neural layer nodes with interconnected synaptic weights.
9. `KaggleMotif` (Kaggle Workshop): Analytical bar matrix and data curve trajectory.

---

## 7. Motion & Animation Tokens

### 7.1 Keyframe Animations

| Animation Name | Timing / Curve | Visual Effect |
|---|---|---|
| `nx-pan` | `40s linear infinite` | Continuous background coordinate grid pan |
| `nx-node` | `3s–4s ease-in-out infinite` | Pulsing opacity (`0.45` to `1.0`) and node glow expansion |
| `nx-breathe` | `7s ease-in-out infinite` | Breathing celestial halo scale and opacity swell |
| `nx-spin` | `90s linear infinite` | Slow planetary orbital rotation |
| `nx-flow` | `1.6s linear infinite` | Flowing dashed stroke line across circuit vectors |
| `nx-sweep` | `7s linear infinite` | Horizontal telemetry laser line sweep |
| `nx-rise` | `variable linear infinite` | Floating particle node elevation |
| `nx-pop` | `0.45s cubic-bezier(.2,.7,.2,1)` | Modal entrance scale and slide reveal |
| `nx-fadein` | `0.3s ease both` | Backdrop overlay fade |

### 7.2 Easing Curves & Transitions
- **Standard Cyber Easing:** `cubic-bezier(0.2, 0.7, 0.2, 1)`
- **Standard Duration:** `300ms` for color/border, `450ms` for transforms/elevation, `800ms` for image zooms.

### 7.3 Accessibility (Reduced Motion)
Both sections strictly enforce `@media (prefers-reduced-motion: reduce)`:
- Animations (`nx-pan`, `nx-spin`, `nx-node`, `nx-flow`) are deactivated (`animation: none !important`).
- Instant state transitions (`transition-duration: 0.01ms !important`).
- Hidden animated reveals default to full visibility (`opacity: 1 !important; transform: none !important`).

---

## 8. Responsive Specifications

| Breakpoint | Target Screen | Layout Behavior |
|---|---|---|
| `< 640px` (`sm`) | Mobile phones | Single column cards; horizontal scroll for filter chips; scaled down headings (`clamp`); modals adapt to bottom-sheet style padding (`20px`). |
| `640px – 1024px` (`md`) | Tablets & foldables | 2-column event and team member grids; constellation orbits scaled down; navigation chips collapse to icon mode. |
| `> 1024px` (`lg`) | Desktops | 3-column / 4-column member grids; full constellation orbit visualization; dual-column alternating department views; 64px background grid visible. |
| `> 1280px` (`xl`) | High-res monitors | Max content width constrained to `max-w-6xl` (`1152px`) or `max-w-7xl` (`1280px`) with centered auto-margins. |
