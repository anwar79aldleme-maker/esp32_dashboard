// api/get.js
import { neon } from "@neondatabase/serverless";

// Connect to Neon using environment variable
const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const results = await client.query("SELECT * FROM sensor_data ORDER BY id DESC LIMIT 50");
    return res.status(200).json(results.rows.reverse()); // آخر 50 قيمة تصاعدياً
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
