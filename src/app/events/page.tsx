import type { Metadata } from "next";
import { Navbar, EventsSection } from "@/components/website";

export const metadata: Metadata = {
  title: "Events | ACM NeurOnyx AIKTC",
  description:
    "Explore hackathons, workshops, and AI/ML experiences hosted by the NeurOnyx ACM Student Chapter at AIKTC.",
};

export default function EventsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D] text-white">
      <Navbar />
      <EventsSection />
    </div>
  );
}
