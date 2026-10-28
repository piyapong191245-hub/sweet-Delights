"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        // สมัครสมาชิก
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
        } else {
          setMessage("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
          setIsSignUp(false);
        }
      } else {
        // เข้าสู่ระบบ
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`);
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setMessage("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-amber-100">
        <h2 className="text-2xl font-bold text-center text-amber-900 mb-2">
          {isSignUp ? "สมัครสมาชิกร้านขนมหวานแม่อารีย์" : "เข้าสู่ระบบ"}
        </h2>
        <p className="text-sm text-center text-amber-700/80 mb-6">
          {isSignUp
            ? "สมัครสมาชิกเพื่อบันทึกที่อยู่จัดส่งและสั่งซื้อได้รวดเร็วขึ้น"
            : "ยินดีต้อนรับเข้าสู่ร้านขนมหวานแม่อารีย์"}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
                placeholder="สมชาย ใจดี"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
              placeholder="yourname@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("สำเร็จ") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-50 mt-2"
          >
            {loading
              ? "กำลังดำเนินการ..."
              : isSignUp
              ? "สมัครสมาชิก"
              : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-amber-800">
          {isSignUp ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชีสมาชิก?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="font-semibold text-amber-600 underline hover:text-amber-700"
          >
            {isSignUp ? "เข้าสู่ระบบ" : "สมัครสมาชิกใหม่"}
          </button>
        </div>
      </div>
    </div>
  );
}