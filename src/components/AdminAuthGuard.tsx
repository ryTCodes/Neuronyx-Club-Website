"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { subscribeToAuth } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AdminAuthGuardProps {
  children: ReactNode;
}

export default function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const adminDoc = await getDoc(
          doc(db, "admins", user.uid)
        );

        if (!adminDoc.exists()) {
          router.replace("/admin/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Admin authorization check failed:", error);
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">
          Checking authorization...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}