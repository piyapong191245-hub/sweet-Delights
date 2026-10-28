"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    toggleCart,
    updateQuantity,
    subtotal,
    openCheckout,
  } = useCart();

  const router = useRouter();

  // กำหนดยอดซื้อขั้นต่ำส่งฟรี (เช่น 300 บาท)
  const FREE_SHIPPING_MIN = 300;
  const isFreeShipping = subtotal >= FREE_SHIPPING_MIN;
  const missingAmount = FREE_SHIPPING_MIN - subtotal;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_MIN) * 100, 100);

  // คำนวณค่าจัดส่งและยอดรวมสุทธิ
  const actualShippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 50) : 0;
  const finalTotal = subtotal + actualShippingFee;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ฟังก์ชันเช็กล็อกอินก่อนดำเนินการสั่งซื้อ
  const handleProceedToCheckout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // ปิดตะกร้าสินค้าก่อนส่งไปหน้าล็อกอิน
      toggleCart();
      router.push("/login");
    } else {
      // ล็อกอินแล้ว ให้เปิด Modal ชำระเงิน
      openCheckout();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!cartOpen}
    >
      {/* Backdrop */}
      <div
        onClick={toggleCart}
        className="absolute inset-0 bg-black/50 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-stone-100/50">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-basket-shopping text-amber-700 text-xl"></i>
              <h3 className="text-lg font-bold text-gray-800">
                ตะกร้าสินค้าของคุณ
              </h3>
            </div>
            <button
              onClick={toggleCart}
              aria-label="ปิดตะกร้า"
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* 🚚 แถบคำนวณโปรโมชันซื้อขั้นต่ำส่งฟรี */}
          <div className="p-4 bg-amber-50/80 border-b border-amber-100 space-y-2">
            {isFreeShipping ? (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-sm"></i>
                🎉 ยอดซื้อครบ ฿{FREE_SHIPPING_MIN} ได้รับสิทธิ์ **จัดส่งฟรี!**
              </p>
            ) : (
              <p className="text-xs font-semibold text-amber-900">
                ซื้ออีกเพียง <span className="font-bold text-amber-700 text-sm">฿{missingAmount}</span> เพื่อรับสิทธิ์จัดส่งฟรี!
              </p>
            )}

            {/* แถบ Progress Bar */}
            <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <i className="fa-solid fa-basket-shopping text-5xl mb-3 opacity-30"></i>
                <p className="text-sm">ตะกร้าของคุณยังว่างอยู่</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-xs text-gray-800 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-amber-800 font-bold mt-0.5">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xs hover:bg-gray-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xs hover:bg-gray-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => updateQuantity(item.id, -item.quantity)}
                    aria-label="ลบสินค้า"
                    className="text-gray-300 hover:text-red-500 p-1 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-5 border-t border-gray-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>ราคารวมสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ค่าจัดส่ง</span>
                {subtotal > 0 ? (
                  isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">ฟรี</span>
                  ) : (
                    <span>฿{actualShippingFee}</span>
                  )
                ) : (
                  <span>฿0</span>
                )}
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-amber-800">
                  ฿{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-amber-700 to-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-300 hover:shadow-stone-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>ดำเนินการสั่งซื้อ</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}