"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  async function handleLogout() {
    try {
      await logoutAdmin();
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
    },
    {
      name: "Team",
      href: "/admin/team",
      icon: Users,
    },
    {
      name: "Forms",
      href: "/admin/forms",
      icon: FileText,
    },
  ];

  const currentNav =
    navigation.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    ) || navigation[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-black/90 px-4 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#38BDF8]">
              NeurOnyx
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Admin Panel</span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-medium text-zinc-400">
                {currentNav.name}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-red-900 hover:text-red-400 transition"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar (Desktop persistent + Mobile slide-out drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-black transition-transform duration-300 ease-in-out lg:w-64 lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 sm:py-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38BDF8] font-bold">
                NeurOnyx Club
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
                Admin Panel
              </h1>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition lg:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white font-semibold text-black shadow-lg shadow-white/5"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-black" : "text-zinc-500"}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-zinc-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-zinc-400 transition hover:bg-red-950/30 hover:text-red-400"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-h-screen flex-1 w-full min-w-0 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}