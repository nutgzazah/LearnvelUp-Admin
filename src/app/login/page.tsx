"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Login Supabase Auth (Check Email/Password)
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // 2. Check email in "admins" table (Whitelist)
      if (authData.user) {
        const { data: adminCheck, error: adminError } = await supabase
          .from("admins") // <--- check at admins table
          .select("id")
          .eq("email", authData.user.email)
          .single();

        //If error or can't find ,not admin
        if (adminError || !adminCheck) {
          await supabase.auth.signOut(); // kick out
          throw new Error("คุณไม่มีสิทธิ์เข้าใช้งาน (Not Authorized)");
        }

        // 3. if approved, go "/"
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login Error:", error.message);
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-custom border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-h3 font-bold text-primary">Admin Login 🦦</h1>
          <p className="text-body text-gray-400 mt-2 font-normal">
            ระบบจัดการหลังบ้าน LearnvelUp
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-small font-bold text-text">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-200 focus:border-primary focus:outline-none text-text"
              placeholder="admin@learnvelup.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-small font-bold text-text">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-200 focus:border-primary focus:outline-none text-text"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-alert/10 text-alert text-small font-medium text-center border border-alert/20">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
