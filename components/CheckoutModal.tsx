"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  useCart,
  type DeliveryType,
  type PaymentMethod,
} from "@/context/CartContext";
import { createBrowserClient } from "@supabase/ssr";

function CheckoutForm({ onSuccess }: { onSuccess: (orderId: string) => void }) {
  const { cart, total, deliveryType, setDeliveryType, closeCheckout } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("promptpay");
  const [slip, setSlip] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          if (profile.full_name) setName(profile.full_name);
          if (profile.phone) setPhone(profile.phone);
          if (profile.address) setAddress(profile.address);
        }
      }
    };
    fetchUserData();
  }, [supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (payment === "promptpay" && !slip) {
      alert("กรุณาแนบสลิปโอนเงินชำระสินค้า");
      return;
    }

    setLoading(true);

    try {
      let slipUrl = "";

      if (slip) {
        const fileExt = slip.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("slips")
          .upload(fileName, slip);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("slips")
            .getPublicUrl(fileName);
          slipUrl = urlData.publicUrl;
        }
      }

      const shippingAddr = deliveryType === "delivery" ? address : "รับหน้าร้าน";

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          customer_name: name,
          customer_phone: phone,
          shipping_address: shippingAddr,
          shipping_provider: deliveryType === "delivery" ? "Flash Express" : "รับหน้าร้าน",
          total_price: total,
          slip_url: slipUrl,
          status: payment === "promptpay" ? "pending_payment" : "pending_cod",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (order && cart.length > 0) {
        const orderItems = cart.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        await supabase.from("order_items").insert(orderItems);
      }

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            phone: phone,
            address: address,
          })
          .eq("id", userId);
      }

      // 🔔 -------------------------------------------------------------
      // ยิงแจ้งเตือนออเดอร์ใหม่เข้า LINE Messaging API
      // ----------------------------------------------------------------
      if (order) {
        try {
          await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              customerName: name,
              customerPhone: phone,
              shippingAddress: shippingAddr,
              totalPrice: total,
              items: cart,
            }),
          });
        } catch (notifyErr) {
          console.error("LINE Notification Failed:", notifyErr);
        }
      }

      // แสดง Popup ขอบคุณสวยๆ
      onSuccess(String(order.id).slice(0, 8).toUpperCase());
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการสั่งซื้อ: ${err.message || "กรุณาลองใหม่อีกครั้ง"}`);
    } finally {
      setLoading(false);
    }
  };

  const deliveryOption = (
    value: DeliveryType,
    label: string,
    iconClass: string
  ) => (
    <label
      className={`border-2 p-3 rounded-2xl flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-800 transition ${
        deliveryType === value
          ? "border-amber-700 bg-stone-100/30"
          : "border-gray-200 hover:border-stone-400"
      }`}
    >
      <input
        type="radio"
        name="delivery_type"
        value={value}
        checked={deliveryType === value}
        onChange={() => setDeliveryType(value)}
        className="text-amber-700 focus:ring-amber-500"
      />
      <i className={iconClass}></i>
      {label}
    </label>
  );

  const paymentOption = (
    value: PaymentMethod,
    label: string,
    iconClass: string
  ) => (
    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
      <input
        type="radio"
        name="payment"
        value={value}
        checked={payment === value}
        onChange={() => setPayment(value)}
        className="text-amber-700"
      />
      <i className={iconClass}></i>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );

  const inputCls =
    "w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition";

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-stone-100/40 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            ชำระเงิน &amp; ข้อมูลการจัดส่ง
          </h3>
          <p className="text-xs text-gray-500">
            กรอกข้อมูลให้ครบถ้วนเพื่อยืนยันคำสั่งซื้อ
          </p>
        </div>
        <button
          onClick={closeCheckout}
          aria-label="ปิด"
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Delivery type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            รูปแบบการรับสินค้า
          </label>
          <div className="grid grid-cols-2 gap-3">
            {deliveryOption(
              "delivery",
              "จัดส่งถึงบ้าน",
              "fa-solid fa-motorcycle text-amber-700 text-lg"
            )}
            {deliveryOption(
              "pickup",
              "รับที่หน้าร้าน",
              "fa-solid fa-store text-amber-500 text-lg"
            )}
          </div>
        </div>

        {/* Customer */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-1">
            ข้อมูลผู้สั่งซื้อ
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                ชื่อ-นามสกุล *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="สมชาย ใจดี"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                เบอร์โทรศัพท์ *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812345678"
                className={inputCls}
              />
            </div>
          </div>

          {deliveryType === "delivery" && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                ที่อยู่จัดส่ง *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด..."
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-1">
            วิธีชำระเงิน
          </h4>
          <div className="space-y-2">
            {paymentOption(
              "promptpay",
              "พร้อมเพย์ QR Code (แนะนำ)",
              "fa-solid fa-qrcode text-blue-600 text-lg"
            )}
            {paymentOption(
              "cod",
              "เก็บเงินปลายทาง (COD)",
              "fa-solid fa-money-bill-wave text-green-600 text-lg"
            )}
          </div>

          {payment === "promptpay" && (
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-3">
              <p className="text-xs font-semibold text-amber-900">
                สแกน QR Code เพื่อชำระเงินยอด ฿{total.toLocaleString()}
              </p>
              <div className="w-40 h-40 bg-white mx-auto rounded-xl flex items-center justify-center p-2 border border-amber-200 shadow-sm">
                <img
                  src={`https://promptpay.io/0801071720/${total}.png`}
                  alt="PromptPay QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-amber-800">
                ชื่อบัญชี: ร้านขนมหวานแม่อารีย์
              </p>

              <div className="text-left pt-2 border-t border-amber-200/60">
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  แนบสลิปการโอนเงิน *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setSlip(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-700 to-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-300 hover:shadow-stone-400 transition-all text-base disabled:opacity-50 cursor-pointer"
        >
          {loading ? "กำลังดำเนินการสั่งซื้อ..." : `ยืนยันการสั่งซื้อ (฿${total.toLocaleString()})`}
        </button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Component หน้าต่างขอบคุณสวยๆ (Success Modal)
// -------------------------------------------------------------
function SuccessModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  return (
    <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-300">
      {/* Icon ติ๊กถูกมีอนิเมชัน */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
        <i className="fa-solid fa-check text-4xl text-emerald-600 animate-bounce"></i>
      </div>

      <h3 className="text-2xl font-black text-gray-800 mb-2">
        ขอบคุณสำหรับการสั่งซื้อ!
      </h3>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        คำสั่งซื้อของท่านถูกบันทึกเรียบร้อยแล้ว<br />
        <span className="font-semibold text-amber-800">"ร้านขนมหวานแม่อารีย์"</span> กำลังเตรียมจัดส่งความอร่อยให้คุณครับ 🧁
      </p>

      {/* รหัสคำสั่งซื้อ */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 mb-6 text-left">
        <div className="flex justify-between items-center text-xs text-amber-900 mb-1">
          <span className="text-gray-500">หมายเลขออเดอร์:</span>
          <span className="font-mono font-bold text-amber-800">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-amber-900">
          <span className="text-gray-500">สถานะ:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            กำลังรอดำเนินการ
          </span>
        </div>
      </div>

      {/* ปุ่มปิด */}
      <button
        onClick={onClose}
        className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
      >
        ตกลง / กลับสู่หน้าหลัก
      </button>
    </div>
  );
}

export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, clearCart } = useCart();
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  if (!checkoutOpen) return null;

  const handleSuccess = (orderId: string) => {
    setCompletedOrderId(orderId);
    clearCart();
  };

  const handleClose = () => {
    setCompletedOrderId(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {completedOrderId ? (
        <SuccessModal orderId={completedOrderId} onClose={handleClose} />
      ) : (
        <CheckoutForm onSuccess={handleSuccess} />
      )}
    </div>
  );
}