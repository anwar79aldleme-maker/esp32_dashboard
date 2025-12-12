import { Client } from "@neondatabase/serverless";

// إنشاء client متصل بقاعدة Neon
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL, // ضع URL الخاص بقاعدة البيانات في Environment Variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;

    if (typeof heartrate !== "number" || typeof spo2 !== "number") {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // الاتصال بالقاعدة، إدخال البيانات
    await client.connect();
    const query = `
      INSERT INTO sensor_data (time, heartrate, spo2)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [Date.now(), heartrate, spo2];
    const result = await client.query(query, values);

    await client.end();

    return res.status(200).json({ message: "Data saved", data: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
