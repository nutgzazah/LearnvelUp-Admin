"use client";
import Link from "next/link"; // อย่าลืม import
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@supabase/supabase-js";
import { useRouter,usePathname } from "next/navigation";
import { FiHome, FiBookOpen, FiPlusCircle, FiUsers } from "react-icons/fi";

// สร้าง Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const navClass = (path: string) =>
  `flex items-center gap-3 px-6 py-3 text-h5 font-semibold transition
   ${pathname === path
     ? "bg-secondary text-black"
     : "text-white hover:bg-secondary"
   }`;


  return (
  <nav className="fixed left-0 top-0 h-screen w-80 bg-primary text-white shadow-custom flex flex-col">
  {/* Header */}
  <div className="px-6 pt-6 pb-4">
    <h2 className="text-h3 font-bold text-center">ระบบจัดการคอร์ส</h2>

    {/* Profile */}
    <div className="mt-6 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center overflow-hidden">
        <span className="text-h4">Test</span>
      </div>
      <p className="mt-3 text-h4 font-semibold">DevMastery</p>
      <p className="text-h6 text-white/70">Admin</p>
    </div>
  </div>

  {/* Menu */}
  <div className="mt-12 flex-1 space-y-3">
    <Link
      href="/teacher"
      className={navClass("/teacher")}
    >
      <FiUsers size={20} className="ml-1 mr-2"/>
      Teacher
    </Link>

    <Link
      href="/"
      className={navClass("/")}
    >
      <FiHome size={20} className="ml-1 mr-2"/>
      Dashboard
    </Link>

    <Link
      href="/course"
      className={navClass("/course")}
    >
      <FiBookOpen size={20} className="ml-1 mr-2" />
      My Course
    </Link>

    <Link
      href="/create"
      className={navClass("/create")}
    >
      <FiPlusCircle size={20} className="ml-1 mr-2"/>
      Create Course
    </Link>
  </div>

  {/* Bottom actions */}
  <div className="p-6 flex flex-col gap-3">
    <ThemeToggle />

    <button
      onClick={handleLogout}
      className="w-full py-3 rounded-full bg-alert text-white text-small font-bold hover:bg-alert/90 transition"
    >
      Log out
    </button>
  </div>
</nav>
  );
}
