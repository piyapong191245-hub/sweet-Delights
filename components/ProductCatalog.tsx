"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { categories, products, type CategoryId } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [currentCategory, setCurrentCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory =
        currentCategory === "all" || p.category === currentCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [currentCategory, searchQuery]);

  const resetFilters = () => {
    setCurrentCategory("all");
    setSearchQuery("");
  };

  return (
    <section
      id="menu"
      className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          เมนูขนมอร่อยของเรา
        </h2>
        <p className="mt-2 text-gray-600">
          เลือกชมขนมหวาน อบใหม่สดๆ พร้อมเสิร์ฟถึงบ้านคุณ
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                currentCategory === cat.id
                  ? "bg-amber-700 text-white shadow-md shadow-stone-300"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาขนม..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/60 flex flex-col justify-between group"
            >
              <div className="relative overflow-hidden h-48">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 ${p.tagColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow`}
                >
                  {p.tag}
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-base mb-1 group-hover:text-amber-800 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div>
                    <span className="text-xs text-gray-400 block">ราคา</span>
                    <span className="text-lg font-extrabold text-amber-800">
                      ฿{p.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-stone-100 text-amber-800 hover:bg-amber-700 hover:text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <i className="fa-solid fa-plus"></i> เพิ่มลงตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <i className="fa-solid fa-cookie text-5xl text-gray-300 mb-3"></i>
          <p className="text-gray-500 font-medium">ไม่พบเมนูขนมที่คุณค้นหา</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-sm text-amber-700 hover:underline"
          >
            ดูรายการทั้งหมด
          </button>
        </div>
      )}
    </section>
  );
}
