import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, customerName, customerPhone, shippingAddress, totalPrice, items } = await req.json();

    // จัดรูปแบบรายการสินค้า
    const itemsList = items && items.length > 0
      ? items.map((item: any) => `• ${item.name || item.product_name} x${item.quantity}`).join("\n")
      : "ไม่มีข้อมูลสินค้า";

    // ข้อความสรุปออเดอร์
    const messageText = `🎉 มีออเดอร์ใหม่เข้ามา! (#${orderId})
------------------------
📦 หมายเลขออเดอร์: #${orderId}
👤 ลูกค้า: ${customerName}
📞 โทร: ${customerPhone}
🏠 ที่อยู่จัดส่ง: ${shippingAddress}
------------------------
🛍️ รายการสินค้า:
${itemsList}
------------------------
💰 ยอดรวมสุทธิ: ฿${totalPrice.toLocaleString()}

เข้าเช็กสลิปและจัดการออเดอร์ได้ที่ Admin Dashboard ครับ!`;

    // ยิง Push Message ผ่าน LINE Messaging API
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: process.env.LINE_ADMIN_USER_ID,
        messages: [
          {
            type: "text",
            text: messageText,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`LINE API Error: ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("LINE Notify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}