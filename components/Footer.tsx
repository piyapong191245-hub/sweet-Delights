const featured = [
  "เค้กช็อกโกแลตสตรอว์เบอร์รี",
  "คุกกี้ช็อกโกแลตชิพเนยสด",
  "ครัวซองต์เนยฝรั่งเศส",
  "ขนมทองหยอดทองหยิบ",
];

const services = [
  "วิธีการสั่งซื้อ",
  "พื้นที่การจัดส่ง",
  "คำถามที่พบบ่อย (FAQ)",
  "นโยบายความเป็นส่วนตัว",
];

const socials = ["fa-facebook-f", "fa-instagram", "fa-line"];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-cookie-bite text-amber-500 text-2xl"></i>
              <span className="text-xl font-bold text-white">Sweet Delights</span>
            </div>
            <p className="text-sm text-gray-400">
              ร้านขนมออนไลน์ เบเกอรี่ทำมือ ปรุงด้วยความรักและใส่ใจเพื่อส่งมอบความสุขให้ทุกคำของคุณ
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">เมนูแนะนำ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {featured.map((t) => (
                <li key={t}>
                  <a href="#menu" className="hover:text-amber-500 transition-colors">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">การบริการลูกค้า</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {services.map((t) => (
                <li key={t}>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">ติดตามเรา</h4>
            <div className="flex space-x-3 text-lg">
              {socials.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="w-10 h-10 bg-gray-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors text-white"
                >
                  <i
                    className={`fa-brands ${icon}`}
                  ></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; 2026 Sweet Delights Bakery. สงวนลิขสิทธิ์ทุกประการ.</p>
        </div>
      </div>
    </footer>
  );
}
