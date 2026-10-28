"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  created_at: string;
  total_price: number;
  status: string;
  shipping_provider: string;
  tracking_number: string | null;
  shipping_address: string;
  order_items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [supabase]);

  const copyTracking = (text: string, orderId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200/60">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            รอตรวจสอบชำระเงิน
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200/60">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            กำลังเตรียมจัดส่ง
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            จัดส่งเรียบร้อยแล้ว
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-600">กำลังดึงข้อมูลประวัติการสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-800 shadow-inner">
              <i className="fa-solid fa-receipt text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">ประวัติการสั่งซื้อของฉัน</h1>
              <p className="text-xs text-stone-500">ติดตามสถานะขนมอร่อยจากร้านแม่อารีย์</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-bold rounded-2xl transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            กลับหน้าหลัก
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-stone-200/80 space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700/60 text-3xl">
              <i className="fa-solid fa-cookie-bite"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800">ยังไม่มีประวัติการสั่งซื้อ</h3>
              <p className="text-xs text-stone-500 mt-1">เลือกซื้อขนมไทยและเบเกอรี่แสนอร่อยได้เลยที่นี่</p>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-700 to-stone-800 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              เลือกช้อปขนมเลย
            </Link>
          </div>
        ) : (
          /* Order List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 font-medium">หมายเลขออเดอร์</span>
                      <span className="font-mono font-bold text-stone-800 text-sm">#{order.id}</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      <i className="fa-regular fa-clock mr-1"></i>
                      {new Date(order.created_at).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    รายการสินค้า
                  </span>
                  <div className="divide-y divide-stone-100">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center border border-amber-200/50">
                            {item.quantity}x
                          </span>
                          <span className="text-stone-700 font-medium">{item.product_name}</span>
                        </div>
                        <span className="font-semibold text-stone-800">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="bg-amber-50/40 p-5 border-t border-stone-100 flex flex-wrap justify-between items-end gap-4">
                  {/* Shipping info */}
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-500 flex items-center gap-1.5">
                      <i className="fa-solid fa-truck-fast text-amber-700"></i>
                      ขนส่ง: <span className="font-semibold text-stone-800">{order.shipping_provider || "Flash Express"}</span>
                    </p>

                    {order.tracking_number ? (
                      <div className="flex items-center gap-2 mt-2 bg-white px-3 py-2 rounded-xl border border-amber-200/80 shadow-2xs">
                        <span className="font-mono font-bold text-amber-900 text-xs">
                          {order.tracking_number}
                        </span>
                        <button
                          onClick={() => copyTracking(order.tracking_number!, order.id)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 cursor-pointer ml-1"
                        >
                          {copiedId === order.id ? (
                            <span className="text-emerald-600"><i className="fa-solid fa-check"></i> คัดลอกแล้ว</span>
                          ) : (
                            <span><i className="fa-regular fa-copy"></i> คัดลอก</span>
                          )}
                        </button>
                        <a
                          href={`https://www.flashexpress.co.th/tracking/?se=${order.tracking_number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold bg-amber-700 text-white px-2 py-0.5 rounded-lg hover:bg-amber-800 transition"
                        >
                          เช็กพัสดุ
                        </a>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic">
                        * ร้านค้ากำลังจัดเตรียมพัสดุ เมื่อจัดส่งแล้วเลข Tracking จะขึ้นตรงนี้ครับ
                      </p>
                    )}
                  </div>

                  {/* Total price */}
                  <div className="text-right ml-auto">
                    <span className="text-[11px] text-stone-500 block font-medium">ยอดรวมสุทธิ</span>
                    <span className="text-xl font-black text-amber-800">
                      ฿{order.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}