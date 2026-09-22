import type { Metadata } from "next";
import { Navbar, TeamSection } from "@/components/website";

export const metadata: Metadata = {
  title: "Team | NeurOnyx AIKTC",
  description:
    "Meet the minds behind NeurOnyx - faculty mentors, executive leadership, technical leads, and creative designers at AIKTC.",
};

export default function TeamsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D] text-white">
      <Navbar />
      <TeamSection />
    </div>
  );
}
