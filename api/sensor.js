import { Client } from "@neondatabase/serverless";

// تهيئة عميل Neon
const client = new Client({
  connectionString: process.env.DATABASE_URL, // ضع URL قاعدة بيانات Neon في Environment Variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    // إذا لم يكن POST
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;

    if (typeof heartrate !== "number" || typeof spo2 !== "number") {
      return res.status(400).json({ message: "Invalid data" });
    }

    // الاتصال بقاعدة البيانات
    await client.connect();

    // إدخال البيانات في جدول sensor_data
    await client.query(
      "INSERT INTO sensor_data (heartrate, spo2) VALUES ($1, $2)",
      [heartrate, spo2]
    );

    await client.end();

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
