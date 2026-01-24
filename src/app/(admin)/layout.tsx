"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin-navbar";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // 👇 Check Login
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    };
    checkUser();
  }, [router]);

  // Loading Page
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-primary font-bold animate-pulse">
          Checking Permission...
        </p>
      </div>
    );
  }

  // 👇 Show Navbar and (children) content
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. show Navbar to all page */}
      <div className="sticky top-0 z-50">
        <AdminNavbar />
      </div>

      {/* 2. children content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
