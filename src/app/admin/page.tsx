"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, FileText, Loader2, Users } from "lucide-react";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import { getEvents } from "@/lib/eventService";
import { getForms } from "@/lib/formService";
import { getTeamMembers } from "@/lib/teamService";

export default function AdminPage() {
  const [counts, setCounts] = useState({
    events: 0,
    team: 0,
    forms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [events, team, forms] = await Promise.all([
          getEvents().catch(() => []),
          getTeamMembers().catch(() => []),
          getForms().catch(() => []),
        ]);
        setCounts({
          events: events.length,
          team: team.length,
          forms: forms.length,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38BDF8] font-bold">
              Overview
            </p>
            <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage the NeurOnyx Club website, events, teams, and forms.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Events */}
            <Link
              href="/admin/events"
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
                  Events
                </span>
                <Calendar size={18} className="text-zinc-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">
                {loading ? <Loader2 size={24} className="animate-spin" /> : counts.events}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Manage club events</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Team Members */}
            <Link
              href="/admin/team"
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
                  Team Members
                </span>
                <Users size={18} className="text-zinc-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">
                {loading ? <Loader2 size={24} className="animate-spin" /> : counts.team}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Manage core members</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Forms */}
            <Link
              href="/admin/forms"
              className="group rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 transition hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                  Forms & Surveys
                </span>
                <FileText size={18} className="text-cyan-400 group-hover:scale-110 transition" />
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">
                {loading ? <Loader2 size={24} className="animate-spin text-cyan-400" /> : counts.forms}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-cyan-400/80">
                <span>Manage form pipelines</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}