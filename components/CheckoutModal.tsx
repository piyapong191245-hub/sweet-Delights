"use client";

import { useState, type FormEvent } from "react";
import {
  useCart,
  type DeliveryType,
  type PaymentMethod,
} from "@/context/CartContext";

const TIME_SLOTS = [
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

/** วันพรุ่งนี้ตามเวลาเครื่องผู้ใช้ รูปแบบ YYYY-MM-DD */
function tomorrowLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function CheckoutForm() {
  const { total, deliveryType, setDeliveryType, closeCheckout, placeOrder } =
    useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(tomorrowLocal);
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [payment, setPayment] = useState<PaymentMethod>("promptpay");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    placeOrder({
      name,
      phone,
      address,
      date,
      time,
      deliveryType,
      paymentMethod: payment,
    });
  };

  const deliveryOption = (
    value: DeliveryType,
    label: string,
    iconClass: string,
  ) => (
    <label
      className={`border-2 p-3 rounded-2xl flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-800 ${
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
    iconClass: string,
  ) => (
    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
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
    "w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-stone-100/40">
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
              "fa-solid fa-motorcycle text-amber-700 text-lg",
            )}
            {deliveryOption(
              "pickup",
              "รับที่หน้าร้าน",
              "fa-solid fa-store text-amber-500 text-lg",
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                วันที่รับ/ส่ง *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                เวลาโดยประมาณ *
              </label>
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t} น.
                  </option>
                ))}
              </select>
            </div>
          </div>
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
              "fa-solid fa-qrcode text-blue-600 text-lg",
            )}
            {paymentOption(
              "cod",
              "เก็บเงินปลายทาง (COD)",
              "fa-solid fa-money-bill-wave text-green-600 text-lg",
            )}
            {paymentOption(
              "credit",
              "บัตรเครดิต / เดบิต",
              "fa-regular fa-credit-card text-purple-600 text-lg",
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-amber-700 to-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-300 hover:shadow-stone-400 transition-all text-base"
        >
          ยืนยันการสั่งซื้อ (฿{total.toLocaleString()})
        </button>
      </form>
    </div>
  );
}

export default function CheckoutModal() {
  const { checkoutOpen } = useCart();
  if (!checkoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <CheckoutForm />
    </div>
  );
}
