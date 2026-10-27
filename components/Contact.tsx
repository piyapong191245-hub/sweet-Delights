export default function Contact() {
  return (
    <section
      id="contact"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-stone-200 px-3 py-1 rounded-full">
            หน้าร้านของเรา
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            แวะมาทักทาย ลิ้มลองความสดใหม่ได้ที่หน้าร้าน
          </h2>
          <p className="text-gray-600">
            เรามีหน้าร้านบรรยากาศอบอบอุ่น ที่จอดรถมากมาย แวะมาชิมมาอุดหนุนได้นะครับ
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-amber-700 shrink-0 mt-1">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">ที่อยู่หน้าร้าน</h4>
                <p className="text-sm text-gray-600">
                  31 หมู่ที่9 ถ. พหลโยธิน ตำบล คลองหนึ่ง อำเภอคลองหลวง ปทุมธานี 12120
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-1">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">เวลาเปิด - ปิด</h4>
                <p className="text-sm text-gray-600">
                  เปิด 24 ชั่วโมง
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-1">
                <i className="fa-brands fa-line"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  ติดต่อสั่งซื้อผ่าน LINE / โทรศัพท์
                </h4>
                <p className="text-sm text-gray-600">LINE Official: @kanomwhanmaeari</p>
                <p className="text-sm text-gray-600">
                  โทร: 081-234-5678, 02-999-8888
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#00B900] text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <i className="fa-brands fa-line text-lg"></i> แอด LINE สั่งซื้อ
            </a>
            <a
              href="tel:0812345678"
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-phone"></i> โทรหาเรา
            </a>
          </div>
        </div>

        {/* Map card */}
        <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
          <div
            className="bg-gray-200 rounded-2xl h-80 w-full relative overflow-hidden flex flex-col justify-center items-center text-center p-6"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-xs border border-stone-200 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white mb-2 shadow-md">
                <i className="fa-solid fa-store"></i>
              </div>
              <p className="font-bold text-gray-800 text-sm">
                ร้านขนมหวานแม่อารีย์
              </p>
              <p className="text-xs text-gray-500">31 หมู่ที่9 ถ. พหลโยธิน ตำบล คลองหนึ่ง อำเภอคลองหลวง ปทุมธานี 12120</p>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 rounded-xl text-xs text-gray-600 shadow flex justify-between items-center">
              <span>📍 โซนลานค้า/ขนมหวาน ตลาดไทย</span>
              <a
                href="https://maps.google.com/?q=Talaad+Thai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                นำทาง ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
