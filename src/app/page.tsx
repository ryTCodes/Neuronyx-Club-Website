"use client";

import {
  Component,
  AboutSection,
  EventsPreviewSection,
  TeamPreviewSection,
  Navbar,
  ContactSection,
  FAQSection,
} from "@/components/website";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D] text-white">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HOME ================= */}
      <section id="home" className="relative z-10 min-h-screen w-full scroll-mt-0">
        <div id="hero" className="absolute top-0" />
        <Component />
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="relative z-10 scroll-mt-0">
        <AboutSection />
      </section>

      {/* ================= EVENTS PREVIEW ================= */}
      <section id="events-preview" className="relative z-10 scroll-mt-0">
        <div id="events" className="absolute top-0" />
        <EventsPreviewSection />
      </section>

      {/* ================= TEAM PREVIEW ================= */}
      <section id="team-preview" className="relative z-10 scroll-mt-0">
        <div id="teams" className="absolute top-0" />
        <TeamPreviewSection />
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section id="achievements" className="relative z-10 scroll-mt-0">
        {/* Add AchievementsSection here */}
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="relative z-10 scroll-mt-0">
        <FAQSection />
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative z-10 scroll-mt-0">
        <ContactSection isHome />
      </section>
    </div>
  );
}