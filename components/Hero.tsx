import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-stone-100/70 via-amber-50/40 to-transparent py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-stone-200 text-amber-800 text-sm font-semibold tracking-wide">
              ✨ ขนมอบสดใหม่จากเตาทุกวัน
            </span>

            {/* เพิ่ม leading-[1.5] และ pb-2 เพื่อขยายระยะห่างระหว่างบรรทัดให้สระไม่ชนกัน */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.5] sm:leading-[1.5] lg:leading-[1.5] pb-2">
              สัมผัสความอบอุ่น <br />
              <span className="bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent inline-block pt-1">
                ในทุกๆ คำที่ได้ลิ้มลอง
              </span>
            </h1>

            <p className="text-gray-600 text-lg max-w-lg mx-auto md:mx-0">
              คัดสรรวัตถุดิบพรีเมียม ราคาประหยัด สามารถเก็บไว้ได้นาน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <a
                href="#menu"
                className="px-8 py-4 bg-gradient-to-r from-amber-700 to-stone-800 text-white rounded-full font-semibold shadow-lg shadow-stone-300 hover:shadow-stone-400 hover:-translate-y-0.5 transition-all text-center"
              >
                ดูเมนูทั้งหมด <i className="fa-solid fa-arrow-right ml-2"></i>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
              >
                สั่งทำเค้กพิเศษ / ติดต่อเรา
              </a>
            </div>
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200 max-w-md mx-auto md:mx-0 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">100%</p>
                <p className="text-xs text-gray-500">เนยแท้พรีเมียม</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">Fresh</p>
                <p className="text-xs text-gray-500">อบใหม่รายวัน</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">4.9 ★</p>
                <p className="text-xs text-gray-500">ลูกค้ารีวิวแน่น</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex justify-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-stone-400 to-amber-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative w-full max-w-md bg-white p-4 rounded-3xl shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 border border-amber-100">
              <div className="relative w-full h-80 sm:h-96">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                  alt="เค้กช็อกโกแลตสตรอว์เบอร์รี"
                  fill
                  priority
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="rounded-2xl object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-100">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-amber-700">
                  <i className="fa-solid fa-heart text-xl"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500">เมนูยอดฮิตตลอดกาล</p>
                  <p className="font-bold text-gray-800 text-sm">
                    Strawberry Chocolate Cake
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}