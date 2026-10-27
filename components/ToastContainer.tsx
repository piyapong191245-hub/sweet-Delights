"use client";

import { useCart } from "@/context/CartContext";

export default function ToastContainer() {
  const { toasts } = useCart();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-900/90 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2"
        >
          <i className="fa-solid fa-circle-check text-green-400 text-sm"></i>
          {t.message}
        </div>
      ))}
    </div>
  );
}
