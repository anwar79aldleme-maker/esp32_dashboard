import { neon } from "@neondatabase/serverless";

// إنشاء اتصال مع Neon عبر Environment Variable
const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // قراءة البيانات من جدول sensor_data
    const { rows } = await client.query("SELECT * FROM sensor_data ORDER BY time ASC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Neon error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
