"use client";

import React from "react";

export interface Review {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    name: "คุณเมย์",
    role: "ลูกค้าประจำ",
    comment: "สั่งเวเฟอร์และคุกกี้ประจำ อร่อยมาก รสชาติหอมนุ่ม ไม่หวานเกินไป แพ็คขนมมาอย่างดีจัดส่งไวมากครับ",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "คุณนนท์",
    role: "สั่งซื้อผ่านออนไลน์",
    comment: "คุกกี้เนยสดหอมมากกก เปิดกล่องมาคือกลิ่นเตะจมูก อบใหม่จริงๆ กินกับกาแฟตอนเช้าคือเข้ากันที่สุด",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "คุณแพรว",
    role: "สั่งซื้อหน้าร้านตลาดไทย",
    comment: "ขนมร้านนี้ละมุนมาก ไม่หวานตัดขา ใชวัตถุดิบดีจริง ราคาก็น่ารัก เหมาะซื้อเป็นของฝากญาติผู้ใหญ่มากๆ ค่ะ",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
  },
];

export default function Reviews({ reviews = defaultReviews }: { reviews?: Review[] }) {
  return (
    <section id="reviews" className="bg-amber-50/50 py-16 border-t border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">เสียงตอบรับจากลูกค้า</h2>
          <p className="text-gray-600 mt-2">ความประทับใจจริงจากผู้ที่ได้ลิ้มลองความอร่อยของเรา</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(reviews || defaultReviews).map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-500 text-sm mb-3">
                  {Array.from({ length: r.rating || 5 }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.comment}"</p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}