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


  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0">
        <AdminNavbar />
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
