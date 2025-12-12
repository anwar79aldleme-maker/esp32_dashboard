// api/get.js
import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  // فقط GET مسموح
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // إنشاء Client جديد لكل طلب لتجنب مشاكل Neon serverless
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // تأكد أن لديك DATABASE_URL في Vercel
  });

  try {
    await client.connect();

    // جلب آخر 50 سجل من جدول sensor_data
    const result = await client.query(
      "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 50"
    );

    await client.end();

    // إعادة البيانات مرتبة من الأقدم للأحدث
    return res.status(200).json(result.rows.reverse());
  } catch (error) {
    console.error("Error fetching data:", error);
    await client.end();
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
