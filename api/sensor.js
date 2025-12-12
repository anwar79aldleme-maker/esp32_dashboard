// api/sensor.js
import { Pool } from "@neondatabase/serverless";

// إنشاء Pool مرة واحدة فقط لكل Serverless Function
let pool;
if (!global._neonPool) {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });
  global._neonPool = pool;
} else {
  pool = global._neonPool;
}

export default async function handler(req, res) {
  // السماح فقط بالـ POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;

    // التحقق من البيانات
    if (
      typeof heartrate !== "number" ||
      typeof spo2 !== "number" ||
      heartrate <= 0 ||
      spo2 <= 0
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // إدخال البيانات في Neon
    const result = await pool.query(
      "INSERT INTO sensor_data (time, heartrate, spo2) VALUES ($1, $2, $3) RETURNING *",
      [Date.now(), heartrate, spo2]
    );

    return res.status(200).json({ message: "Data saved", data: result.rows[0] });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
