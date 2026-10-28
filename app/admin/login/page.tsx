"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้เป็นแอดมิน");
      setLoading(false);
    } else if (data.session) {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-md border border-stone-200/80 space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            Admin Portal
          </span>
          <h1 className="text-2xl font-black text-stone-800">
            เข้าสู่ระบบแอดมิน
          </h1>
          <p className="text-xs text-stone-400">ร้านขนมหวานแม่อารีย์</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              อีเมล (Admin Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full p-3 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              รหัสผ่าน (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-2xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}