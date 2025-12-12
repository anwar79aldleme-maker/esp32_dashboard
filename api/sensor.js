// api/sensor.js
import { Client } from "@neondatabase/serverless";

// إنشاء client ثابت لا يعاد الاتصال به لكل طلب
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;

    if (heartrate == null || spo2 == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const query = `
      INSERT INTO sensor_data (time, heartrate, spo2)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [Date.now(), heartrate, spo2];
    const result = await client.query(query, values);

    return res.status(200).json({ message: "Data saved", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
