// api/sensor.js
import { Client } from "@neondatabase/serverless";

let client;

if (!global._neonClient) {
  client = new Client({
    connectionString: process.env.NEON_DATABASE_URL,
  });
  global._neonClient = client;
} else {
  client = global._neonClient;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;

    if (typeof heartrate !== "number" || typeof spo2 !== "number") {
      return res.status(400).json({ message: "Invalid data" });
    }

    await client.connect(); // تأكد من الاتصال مرة واحدة فقط
    const result = await client.query(
      "INSERT INTO sensor_data (time, heartrate, spo2) VALUES ($1, $2, $3) RETURNING *",
      [Date.now(), heartrate, spo2]
    );
    await client.end(); // أغلق الاتصال بعد كل عملية

    return res.status(200).json({ message: "Data saved", data: result.rows[0] });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
