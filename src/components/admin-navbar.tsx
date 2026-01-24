"use client";
import Link from "next/link"; // อย่าลืม import
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// สร้าง Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-card  shadow-custom">
      <h2 className="text-h4 font-bold text-primary">Admin Console 🦦</h2>

      <div className="flex items-center gap-4">
        <div className="flex gap-4 mr-4">
          <Link href="/" className="font-bold text-text hover:text-primary">
            Dashboard
          </Link>
          <Link
            href="/courses"
            className="font-bold text-text hover:text-primary"
          >
            Courses
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {/* ... Theme/Logout ... */}
        </div>
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-alert text-white rounded-lg text-small font-bold hover:bg-alert/90 transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
