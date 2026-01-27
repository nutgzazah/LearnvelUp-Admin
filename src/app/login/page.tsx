"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  const [showPassword, setShowPassword] = useState(false);
  
  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
  <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-custom bg-background">
    <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
  <div className="flex min-h-[520px]">
    {/* Left 30% */}
    <div className="w-[40%] bg-primary flex items-center justify-center px-10">
      <div className="text-center">
        <Image
          src="/images/otter_main_bgyellow.png"
          alt="Otter"
          width={200}
          height={200}
          priority
          className="rounded-full overflow-hidden"
        />
        <h1 className="text-h2 font-normal text-white">LearnvelUp</h1>
        <p className="mt-3 text-h5 text-white/70">ระบบจัดการคอร์ส</p>
      </div>
    </div>

    {/* Right 70% */}
    <div className="w-[60%] bg-background flex items-center justify-center px-12">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-12">
          <div className="text-center mb-16">
            <h2 className="text-h4 font-semibold text-text ">เข้าสู่ระบบ</h2>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-full bg-white border border-black/10 focus:border-black/20 focus:outline-none text-black shadow-sm"
              placeholder="อีเมล"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-full bg-white border border-black/10 focus:border-black/20 focus:outline-none text-black shadow-sm"
              placeholder="รหัสผ่าน"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-600 text-sm font-medium text-center border border-red-500/20">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary hover:opacity-95 text-white font-medium py-3 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
</div>
  );
}
