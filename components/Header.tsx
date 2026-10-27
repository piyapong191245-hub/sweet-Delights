"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "#hero", label: "หน้าแรก" },
  { href: "#menu", label: "เมนูขนม" },
  { href: "#reviews", label: "รีวิวจากลูกค้า" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
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
          </a>

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
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              aria-label="เปิดตะกร้าสินค้า"
              className="relative p-3 bg-stone-100 text-amber-800 rounded-full hover:bg-stone-200 transition-all focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="เมนู"
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2"
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
        </div>
      )}
    </header>
  );
}
