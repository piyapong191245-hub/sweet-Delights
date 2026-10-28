"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

// รายชื่ออีเมลที่มีสิทธิ์เป็น Admin
const ADMIN_EMAILS = ["piyapong.s66@rsu.ac.th", "admin@maearee.com"];

const navLinks = [
  { href: "#hero", label: "หน้าแรก" },
  { href: "#menu", label: "เมนูขนม" },
  { href: "#reviews", label: "รีวิวจากลูกค้า" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // ติดตามสถานะเมื่อมีการ Login / Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // ตรวจสอบว่าผู้ใช้ปัจจุบันเป็นแอดมินหรือไม่
  const isAdmin = user && user.email && ADMIN_EMAILS.includes(user.email);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform duration-300">
              <i className="fa-solid font-bold text-2xl fa-cookie-bite"></i>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                ร้านขนมหวานแม่อารีย์
              </span>
              <span className="block text-xs text-gray-500 font-light -mt-1">
                Handmade Bakery &amp; Desserts
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-amber-700 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ปุ่มเข้าสู่ระบบ / โปรไฟล์ */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-medium text-amber-900 hidden sm:inline">
                  👋 {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>

                {/* ปุ่มประวัติการสั่งซื้อสำหรับลูกค้าทุกคนที่ล็อกอิน */}
                <Link
                  href="/orders"
                  className="px-3 py-1.5 text-xs sm:text-sm bg-amber-50 text-amber-800 border border-amber-200 rounded-full hover:bg-amber-100 transition font-medium flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-receipt"></i>
                  <span className="hidden sm:inline">ประวัติสั่งซื้อ</span>
                </Link>

                {/* แสดงปุ่มจัดการหลังร้านเฉพาะผู้ที่เป็น Admin เท่านั้น */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 text-xs sm:text-sm bg-stone-800 text-white rounded-full hover:bg-black transition font-medium flex items-center gap-1.5 shadow-sm animate-fade-in"
                  >
                    <i className="fa-solid fa-user-gear"></i>
                    <span className="hidden sm:inline">หลังร้าน</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs sm:text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition font-medium cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-full text-xs sm:text-sm font-semibold transition shadow-sm"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* ปุ่มตะกร้าสินค้า */}
            <button
              onClick={toggleCart}
              aria-label="เปิดตะกร้าสินค้า"
              className="relative p-3 bg-stone-100 text-amber-800 rounded-full hover:bg-stone-200 transition-all focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="เมนู"
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2 cursor-pointer"
            >
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
            >
              {l.label}
            </a>
          ))}

          {user && (
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 bg-amber-50 text-amber-800 font-semibold rounded-xl text-sm border border-amber-200"
              >
                🧾 ประวัติการสั่งซื้อ
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2 bg-stone-800 text-white font-semibold rounded-xl text-sm"
                >
                  ⚙️ จัดการระบบหลังร้าน
                </Link>
              )}
            </div>
          )}

          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-2 bg-amber-700 text-white font-semibold rounded-xl text-sm"
            >
              เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          )}
        </div>
      )}
    </header>
  );
}