"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  total_price: number;
  slip_url: string;
  status: string;
  shipping_provider: string;
  tracking_number: string;
  order_items: OrderItem[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<{ [key: number]: string }>({});
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<{ id: number; items: OrderItem[] } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        fetchAllOrders();
      }
    };
    checkUser();
  }, [router, supabase]);

  // ดึงข้อมูลออเดอร์พร้อม order_items สินค้าย่อย
  const fetchAllOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      showToast(`❌ ไม่สามารถอัปเดตสถานะได้: ${error.message}`);
      fetchAllOrders();
    } else {
      showToast(`✨ อัปเดตสถานะออเดอร์ #${orderId} เรียบร้อยแล้ว!`);
    }
  };

  const saveTrackingNumber = async (orderId: number) => {
    const tracking = trackingInputs[orderId];
    if (!tracking) {
      showToast("⚠️ กรุณากรอกเลขพัสดุก่อนบันทึก");
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number: tracking,
        status: "shipped",
      })
      .eq("id", orderId);

    if (error) {
      showToast(`❌ เกิดข้อผิดพลาด: ${error.message}`);
    } else {
      showToast(`📦 บันทึกเลขพัสดุสำหรับออเดอร์ #${orderId} เรียบร้อยแล้ว!`);
      fetchAllOrders();
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", deleteId);

    if (error) {
      showToast(`❌ ลบไม่สำเร็จ: ${error.message}`);
    } else {
      showToast(`🗑️ ลบออเดอร์ #${deleteId} เรียบร้อยแล้ว!`);
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
    }
    setDeleteId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const totalSales = orders.reduce((sum, o) => sum + o.total_price, 0);
  const pendingCount = orders.filter((o) => o.status === "pending_payment").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-600">กำลังตรวจสอบสิทธิ์ Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 p-4 sm:p-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white ml-2">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                Admin Center
              </span>
              <span className="text-xs text-stone-400">ร้านขนมหวานแม่อารีย์</span>
            </div>
            <h1 className="text-2xl font-black text-stone-800 mt-1">
              ระบบจัดการคำสั่งซื้อ (Orders Management)
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition flex items-center gap-2"
            >
              <i className="fa-solid fa-store"></i>
              ไปหน้าหน้าร้าน
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-2xl transition cursor-pointer"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
              <i className="fa-solid fa-coins"></i>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">ยอดขายรวมทั้งหมด</p>
              <h3 className="text-xl font-bold text-stone-800">฿{totalSales.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl">
              <i className="fa-solid fa-box"></i>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">คำสั่งซื้อทั้งหมด</p>
              <h3 className="text-xl font-bold text-stone-800">{orders.length} ออเดอร์</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">รอตรวจสลิปชำระเงิน</p>
              <h3 className="text-xl font-bold text-amber-600">{pendingCount} รายการ</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="fa-solid fa-truck"></i>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">จัดส่งเรียบร้อยแล้ว</p>
              <h3 className="text-xl font-bold text-emerald-600">{shippedCount} รายการ</h3>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h2 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <i className="fa-solid fa-list-check text-amber-800"></i>
              รายการคำสั่งซื้อล่าสุด
            </h2>
            <button
              onClick={fetchAllOrders}
              className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right"></i> รีเฟรชข้อมูล
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200/80">
                <tr>
                  <th className="p-4">ออเดอร์</th>
                  <th className="p-4">รายการสินค้า</th>
                  <th className="p-4">ลูกค้า &amp; ที่อยู่จัดส่ง</th>
                  <th className="p-4">ยอดรวม</th>
                  <th className="p-4 text-center">สลิป</th>
                  <th className="p-4">สถานะออเดอร์</th>
                  <th className="p-4">เลขพัสดุ FLASH EXPRESS</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-4 align-top">
                      <span className="font-mono font-bold text-stone-800 text-sm block">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(order.created_at).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </td>

                    {/* ปุ่มดูรายการสินค้า */}
                    <td className="p-4 align-top">
                      <button
                        onClick={() => setSelectedOrderItems({ id: order.id, items: order.order_items || [] })}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-[11px] transition cursor-pointer flex items-center gap-1"
                      >
                        <i className="fa-solid fa-bag-shopping text-amber-700"></i>
                        ดูสินค้า ({order.order_items?.length || 0})
                      </button>
                    </td>

                    <td className="p-4 align-top max-w-xs">
                      <p className="font-bold text-stone-800">{order.customer_name}</p>
                      <p className="text-stone-500 font-mono my-0.5">{order.customer_phone}</p>
                      <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed">
                        {order.shipping_address}
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <span className="font-black text-amber-800 text-sm">
                        ฿{order.total_price.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-4 align-top text-center">
                      {order.slip_url ? (
                        <button
                          onClick={() => setSelectedSlip(order.slip_url)}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-[11px] transition cursor-pointer shadow-2xs inline-flex items-center gap-1"
                        >
                          <i className="fa-regular fa-image"></i>
                          ดูสลิป
                        </button>
                      ) : (
                        <span className="text-stone-300 italic">ไม่มีสลิป</span>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs p-2 rounded-xl border font-bold cursor-pointer transition focus:outline-none ${
                          order.status === "shipped"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status === "paid"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="pending_payment">รอตรวจสอบ</option>
                        <option value="paid">ชำระแล้ว / กำลังเตรียม</option>
                        <option value="shipped">จัดส่งแล้ว</option>
                      </select>
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="กรอกเลข Flash"
                          defaultValue={order.tracking_number || ""}
                          onChange={(e) =>
                            setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })
                          }
                          className="p-2 border border-stone-200 text-xs rounded-xl w-36 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                        />
                        <button
                          onClick={() => saveTrackingNumber(order.id)}
                          className="px-3 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                        >
                          บันทึก
                        </button>
                      </div>
                    </td>

                    <td className="p-4 align-top text-center">
                      <button
                        onClick={() => setDeleteId(order.id)}
                        title="ลบออเดอร์"
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    {/* Modal ป๊อปอัปรายการสินค้า */}
{selectedOrderItems && (
  <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    onClick={() => setSelectedOrderItems(null)}
  >
    <div
      className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Modal */}
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
          <i className="fa-solid fa-cookie-bite text-amber-700"></i>
          รายการสินค้า ออเดอร์ #{selectedOrderItems.id}
        </h3>
        <button
          onClick={() => setSelectedOrderItems(null)}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-full cursor-pointer transition"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      {/* List รายการสินค้า */}
      <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
        {selectedOrderItems.items.length === 0 ? (
          <p className="text-stone-400 text-xs text-center py-6">ไม่มีข้อมูลรายการสินค้า</p>
        ) : (
          selectedOrderItems.items.map((item) => (
            <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px]">
                  {item.quantity}x
                </span>
                {/* ชื่อสินค้าใช้ตัวหนังสือหนา ปรับสีชัดเจนแบบในภาพ */}
                <span className="font-extrabold text-stone-800 text-sm tracking-tight">
                  {item.product_name}
                </span>
              </div>
              <span className="font-black text-stone-900 text-sm">
                ฿{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* สรุปราคารวมสินค้าทั้งหมด */}
      {selectedOrderItems.items.length > 0 && (
        <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
          <span className="text-stone-500 font-bold">ราคารวมสินค้าทั้งหมด</span>
          <span className="font-black text-amber-900 text-base">
            ฿{selectedOrderItems.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
          </span>
        </div>
      )}

      {/* ปุ่มปิด */}
      <button
        onClick={() => setSelectedOrderItems(null)}
        className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-black transition shadow-xs"
      >
        ปิดหน้าต่าง
      </button>
    </div>
  </div>
)}

      {/* Modal ยืนยันการลบออเดอร์ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-base">ยืนยันการลบออเดอร์ #{deleteId}?</h3>
              <p className="text-stone-400 text-xs mt-1">
                การดำเนินการนี้ไม่สามารถยกเลิกได้ รายการจะถูกลบออกจากระบบทันที
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ดูสลิป */}
      {selectedSlip && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSlip(null)}
        >
          <div
            className="bg-white rounded-3xl p-4 max-w-lg w-full shadow-2xl relative space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2 px-2">
              <h3 className="font-bold text-stone-800 text-sm">หลักฐานการชำระเงิน (สลิป)</h3>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full text-lg cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-2xl border border-stone-100 flex items-center justify-center bg-stone-50 p-2">
              <img
                src={selectedSlip}
                alt="สลิปโอนเงิน"
                className="max-w-full h-auto rounded-xl shadow-xs"
              />
            </div>
            <button
              onClick={() => setSelectedSlip(null)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-black transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}