"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ReceiptModal() {
  const { order, closeReceipt } = useCart();
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl border border-stone-200 relative">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto">
          <i className="fa-solid fa-check"></i>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">สั่งซื้อสำเร็จ! 🎉</h3>
          <p className="text-xs text-gray-500 mt-1">
            ขอบคุณที่อุดหนุน Sweet Delights Bakery ครับ
          </p>
        </div>

        {/* Receipt */}
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-dashed border-amber-200 text-left text-xs space-y-3 font-mono">
          <div className="border-b border-dashed border-amber-300 pb-2 mb-2 text-center">
            <p className="font-bold text-sm">เลขที่คำสั่งซื้อ: {order.id}</p>
            <p className="text-[10px] text-gray-500">วันที่: {order.createdAt}</p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>ชื่อผู้สั่ง:</strong> {order.name}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {order.phone}
            </p>
            <p>
              <strong>การรับสินค้า:</strong>{" "}
              {order.deliveryType === "delivery"
                ? `จัดส่งถึงบ้าน (${order.address})`
                : "รับเองที่หน้าร้าน"}
            </p>
            <p>
              <strong>นัดรับวันที่:</strong> {order.date} เวลา {order.time}
            </p>
            {order.note && (
              <p className="text-amber-800">
                <strong>โน้ต:</strong> {order.note}
              </p>
            )}
          </div>
          <div className="border-t border-dashed border-amber-300 pt-2 mt-2 space-y-1">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>
                  {i.name} x{i.quantity}
                </span>
                <span>฿{(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-gray-500 pt-1">
              <span>ค่าจัดส่ง</span>
              <span>฿{order.shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-amber-200">
              <span>ราคารวมทั้งสิ้น</span>
              <span className="text-amber-800">
                ฿{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* PromptPay QR (ตัวอย่างสำหรับ mockup) */}
        {order.paymentMethod === "promptpay" && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              สแกน QR Code เพื่อชำระเงิน (พร้อมเพย์)
            </p>
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021229370016A000000677010111011300668123456785802TH5303764"
              alt="QR Code"
              width={144}
              height={144}
              unoptimized
              className="w-36 h-36 mx-auto border p-1 bg-white rounded-lg"
            />
            <p className="text-[10px] text-gray-400 mt-2">
              บริษัท สวีท ดีไลท์ เบเกอรี่ จำกัด (081-234-5678)
            </p>
          </div>
        )}

        <button
          onClick={closeReceipt}
          className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}
